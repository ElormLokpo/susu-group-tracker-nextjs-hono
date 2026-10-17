import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { groups, transactions } from "../../db/schema";
import { ConflictError, NotFoundError, UnprocessableError } from "../../utils/errors";
import { formatGHS } from "../../utils/money";
import { getWeekBalances, listMembers, lockGroup, serializeTransaction } from "../shared";



export const recordContribution = async (
    groupId: string,
    input: { userId: string; amount: number; week?: number },
    recordedBy: string,
) => {
    return db.transaction(async (tx) => {
        const group = await lockGroup(tx, groupId);

        if (group.status !== "active") {
            throw new ConflictError(
                group.status === "pending"
                    ? "Group has not started yet — contributions open once the group is started"
                    : "Group has completed all its weeks",
                "GROUP_NOT_ACTIVE",
            );
        }

        const week = input.week ?? group.currentWeek;
        if (week !== group.currentWeek) {
            throw new UnprocessableError(
                `Contributions can only be recorded for the current week (week ${group.currentWeek})`,
                "WRONG_WEEK",
            );
        }

        const balances = await getWeekBalances(tx, group, week);
        const member = balances.find((b) => b.userId === input.userId);
        if (!member) {
            throw new NotFoundError("That user is not a member of this group", "MEMBER_NOT_FOUND");
        }

        if (member.owes === 0) {
            throw new ConflictError(`${member.name} has already paid in full for week ${week}`, "ALREADY_PAID");
        }
        if (input.amount > member.owes) {
            throw new UnprocessableError(
                `Payment of ${formatGHS(input.amount)} exceeds the ${formatGHS(member.owes)} ${member.name} owes for week ${week}`,
                "OVERPAYMENT",
                { owes: formatGHS(member.owes), attempted: formatGHS(input.amount) },
            );
        }

        const [row] = await tx
            .insert(transactions)
            .values({ groupId, userId: input.userId, type: "contribution", week, amount: input.amount, recordedBy })
            .returning();

        const paid = member.paid + input.amount;
        const owes = member.owes - input.amount;

        return {
            transaction: serializeTransaction(row),
            member: {
                userId: member.userId,
                name: member.name,
                paid: formatGHS(paid),
                owes: formatGHS(owes),
                paidInFull: owes === 0,
            },
        };
    });
}


export const closeWeek = async (groupId: string, closedBy: string) => {
    return db.transaction(async (tx) => {
        const group = await lockGroup(tx, groupId);
        if (group.status !== "active") {
            throw new ConflictError(
                group.status === "pending" ? "Group has not started yet" : "Group has completed all its weeks",
                "GROUP_NOT_ACTIVE",
            );
        }

        const week = group.currentWeek;
        const balances = await getWeekBalances(tx, group, week);
        const debtors = balances.filter((b) => b.owes > 0);

        if (debtors.length > 0) {
            return {
                closed: false as const,
                week,
                message: debtors.map((d) => `${d.name} owes ${formatGHS(d.owes)}`).join("; "),
                owing: debtors.map((d) => ({
                    userId: d.userId,
                    name: d.name,
                    paid: formatGHS(d.paid),
                    owes: formatGHS(d.owes),
                })),
            };
        }

        const members = await listMembers(tx, groupId);
        const recipient = members.find((m) => m.position === week);
        if (!recipient) throw new NotFoundError("No recipient found for this week", "RECIPIENT_NOT_FOUND");

        const pot = balances.reduce((sum, b) => sum + b.paid, 0);

        const [payout] = await tx
            .insert(transactions)
            .values({ groupId, userId: recipient.userId, type: "payout", week, amount: pot, recordedBy: closedBy })
            .returning();

        const isLastWeek = week >= members.length;
        const [updated] = await tx
            .update(groups)
            .set(isLastWeek ? { status: "completed" } : { currentWeek: week + 1 })
            .where(eq(groups.id, groupId))
            .returning();

        const nextRecipient = isLastWeek ? null : members.find((m) => m.position === week + 1);

        return {
            closed: true as const,
            week,
            payout: {
                recipient: { userId: recipient.userId, name: recipient.name },
                amount: formatGHS(pot),
                transaction: serializeTransaction(payout),
            },
            groupStatus: updated.status,
            nextWeek: isLastWeek ? null : updated.currentWeek,
            nextRecipient: nextRecipient ? { userId: nextRecipient.userId, name: nextRecipient.name } : null,
        };
    });
}

export const list = async (groupId: string, filters: { type?: "contribution" | "payout"; week?: number; userId?: string }) => {
    const conditions = [eq(transactions.groupId, groupId)];
    if (filters.type) conditions.push(eq(transactions.type, filters.type));
    if (filters.week) conditions.push(eq(transactions.week, filters.week));
    if (filters.userId) conditions.push(eq(transactions.userId, filters.userId));

    const rows = await db
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(asc(transactions.createdAt));
    return rows.map(serializeTransaction);
}
