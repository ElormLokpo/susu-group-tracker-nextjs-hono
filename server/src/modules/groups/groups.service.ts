import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { groupMembers, groups, Member, transactions, users } from "../../db/schema";
import type { AuthUser } from "../auth/auth.types";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors";
import { formatGHS } from "../../utils/money";
import {
    findGroup,
    getWeekBalances,
    listMembers,
    lockGroup,
    serializeGroup,
} from "../shared";

const MIN_MEMBERS = 2;


export const createGroup = async (input: { name: string; weeklyAmount: number }, createdBy: string) => {
    const [row] = await db
        .insert(groups)
        .values({ name: input.name, weeklyAmount: input.weeklyAmount, createdBy })
        .returning();
    return serializeGroup(row);
}


export const listGroups = async (user: AuthUser) => {
    if (user.role === "admin") {
        const rows = await db.select().from(groups).orderBy(asc(groups.createdAt));
        return rows.map(serializeGroup);
    }
    const rows = await db
        .select({ group: groups })
        .from(groups)
        .innerJoin(groupMembers, eq(groupMembers.groupId, groups.id))
        .where(eq(groupMembers.userId, user.id))
        .orderBy(asc(groups.createdAt));
    return rows.map((r) => serializeGroup(r.group));
}

export const getGroup = async (groupId: string) => {
    const group = await findGroup(db, groupId);
    const members = await listMembers(db, groupId);
    return {
        ...serializeGroup(group),
        members: members.map((m) => ({ userId: m.userId, name: m.name, position: m.position, joinedAt: m.joinedAt })),
    };
}


export const assertCanView = async (user: AuthUser, groupId: string) => {
    await findGroup(db, groupId);
    if (user.role === "admin") return;
    const [row] = await db
        .select({ id: groupMembers.id })
        .from(groupMembers)
        .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)))
        .limit(1);
    if (!row) throw new ForbiddenError("You are not a member of this group");
}

export const addMember = async (groupId: string, userId: string) => {
    return db.transaction(async (tx) => {
        const group = await lockGroup(tx, groupId);
        if (group.status !== "pending") {
            throw new ConflictError(
                "Members can only be added before the group has started (payout order is fixed once week 1 begins)",
                "GROUP_ALREADY_STARTED",
            );
        }

        const [user] = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) throw new NotFoundError("User not found", "USER_NOT_FOUND");

        const [dup] = await tx
            .select({ id: groupMembers.id })
            .from(groupMembers)
            .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)))
            .limit(1);
        if (dup) throw new ConflictError(`${user.name} is already in this group`, "DUPLICATE_MEMBER");

        const [{ max }] = await tx
            .select({ max: sql<string>`coalesce(max(${groupMembers.position}), 0)` })
            .from(groupMembers)
            .where(eq(groupMembers.groupId, groupId));

        const [row] = await tx
            .insert(groupMembers)
            .values({ groupId, userId, position: Number(max) + 1 })
            .returning();

        return { groupId, userId: row.userId, name: user.name, position: row.position, joinedAt: row.joinedAt };
    });
}


export const startWeek = async (groupId: string) => {
    return db.transaction(async (tx) => {
        const group = await lockGroup(tx, groupId);
        if (group.status !== "pending") {
            throw new ConflictError(`Group is already ${group.status}`, "GROUP_ALREADY_STARTED");
        }
        const members = await listMembers(tx, groupId);
        if (members.length < MIN_MEMBERS) {
            throw new ConflictError(`A susu needs at least ${MIN_MEMBERS} members to start`, "NOT_ENOUGH_MEMBERS");
        }
        const [updated] = await tx
            .update(groups)
            .set({ status: "active", currentWeek: 1 })
            .where(eq(groups.id, groupId))
            .returning();

        return {
            ...serializeGroup(updated),
            payoutOrder: members.map((m) => ({ week: m.position, userId: m.userId, name: m.name })),
        };
    });
}

export const getReport = async (groupId: string) => {
    const group = await findGroup(db, groupId);
    const members = await listMembers(db, groupId);
    const isActive = group.status === "active";

    const balances = isActive ? await getWeekBalances(db, group, group.currentWeek) : [];
    const recipient = isActive ? members.find((m) => m.position === group.currentWeek) : undefined;

    const payoutRows = await db
        .select({
            week: transactions.week,
            amount: transactions.amount,
            userId: transactions.userId,
            name: users.name,
            paidOutAt: transactions.createdAt,
        })
        .from(transactions)
        .innerJoin(users, eq(users.id, transactions.userId))
        .where(and(eq(transactions.groupId, groupId), eq(transactions.type, "payout")))
        .orderBy(asc(transactions.week));

    return {
        group: serializeGroup(group),
        currentWeek: group.currentWeek,
        totalWeeks: members.length,
        currentRecipient: recipient ? { userId: recipient.userId, name: recipient.name } : null,
        paidInFull: balances
            .filter((b) => b.owes === 0)
            .map((b) => ({ userId: b.userId, name: b.name, paid: formatGHS(b.paid) })),
        owing: balances
            .filter((b) => b.owes > 0)
            .map((b) => ({ userId: b.userId, name: b.name, paid: formatGHS(b.paid), owes: formatGHS(b.owes) })),
        payoutHistory: payoutRows.map((p) => ({
            week: p.week,
            recipient: { userId: p.userId, name: p.name },
            amount: formatGHS(p.amount),
            paidOutAt: p.paidOutAt,
        })),
    };
}
