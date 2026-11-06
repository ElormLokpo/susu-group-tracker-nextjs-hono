import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  groupMembers,
  groups,
  transactions,
  users,
  type NewUser,
} from "../../db/schema";
import type { AuthUser } from "../auth/auth.types";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";
import { formatGHS } from "../../utils/money";
import {
  findGroup,
  getWeekBalances,
  listMembers,
  lockGroup,
  serializeGroup,
} from "../shared";
import bcrypt from "bcryptjs";
import { signToken } from "../auth/auth.jwt";
import {
  buildPayload,
  generateAndSendVerificationCode,
} from "../auth/auth.services";

const MIN_MEMBERS = 2;

export const createGroup = async (
  input: { name: string; weeklyAmount: number; maxNumberOfMembers: number },
  createdBy: string,
) => {
  const inviteLink = crypto.randomUUID();

  const [row] = await db
    .insert(groups)
    .values({
      name: input.name,
      weeklyAmount: input.weeklyAmount,
      createdBy,
      maxNumberOfMembers: input.maxNumberOfMembers,
      inviteLink,
    })
    .returning();
  return serializeGroup(row);
};

export const listGroups = async () => {
  const rows = await db.select().from(groups).orderBy(asc(groups.createdAt));
  return rows.map(serializeGroup);
};

export const getGroup = async (groupId: string) => {
  const group = await findGroup(db, groupId);
  const members = await listMembers(db, groupId);
  return {
    ...serializeGroup(group),
    members: members.map((m) => ({
      userId: m.userId,
      name: m.name,
      position: m.position,
      joinedAt: m.joinedAt,
    })),
  };
};

export const assertCanView = async (user: AuthUser, groupId: string) => {
  await findGroup(db, groupId);
  if (user.role === "admin") return;
  const [row] = await db
    .select({ id: groupMembers.id })
    .from(groupMembers)
    .where(
      and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
    )
    .limit(1);
  if (!row) throw new ForbiddenError("You are not a member of this group");
};

export const joinGroup = async (input: {
  role: "member" | "admin";
  inviteId: string;
  name: string;
  email: string;
  password: string;
}) => {
  return db.transaction(async (tx) => {
    const [group] = await tx
      .select()
      .from(groups)
      .where(eq(groups.inviteLink, input.inviteId))
      .limit(1);
    if (!group) throw new NotFoundError("Group not found", "GROUP_NOT_FOUND");

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existingUser) {
      const [dup] = await tx
        .select({ id: groupMembers.id })
        .from(groupMembers)
        .where(
          and(
            eq(groupMembers.groupId, group.id),
            eq(groupMembers.userId, existingUser.id),
          ),
        )
        .limit(1);
      if (dup)
        throw new ConflictError(
          `${existingUser.name} is already in this group`,
          "DUPLICATE_MEMBER",
        );

      const [{ max }] = await tx
        .select({
          max: sql<string>`coalesce(max(${groupMembers.position}), 0)`,
        })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, group.id));

      const totalGroupMembers = await db.$count(
        groupMembers,
        eq(groupMembers.groupId, group.id),
      );

      if (totalGroupMembers >= group.maxNumberOfMembers)
        throw new ConflictError(`Group is already full`, "GROUP_FULL");

      await tx
        .insert(groupMembers)
        .values({
          groupId: group.id,
          userId: existingUser.id,
          position: Number(max) + 1,
        })
        .returning();

      const token = await signToken(buildPayload(existingUser));

      return token;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash,
        role: "member",
        name: input.name,
      } satisfies NewUser)
      .returning();

    const [dup] = await tx
      .select({ id: groupMembers.id })
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, group.id),
          eq(groupMembers.userId, user.id),
        ),
      )
      .limit(1);
    if (dup)
      throw new ConflictError(
        `${user.name} is already in this group`,
        "DUPLICATE_MEMBER",
      );

    const [{ max }] = await tx
      .select({ max: sql<string>`coalesce(max(${groupMembers.position}), 0)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, group.id));

    const totalGroupMembers = await db.$count(
      groupMembers,
      eq(groupMembers.groupId, group.id),
    );

    if (totalGroupMembers >= group.maxNumberOfMembers)
      throw new ConflictError(`Group is already full`, "GROUP_FULL");

    await tx
      .insert(groupMembers)
      .values({ groupId: group.id, userId: user.id, position: Number(max) + 1 })
      .returning();

    const token = await signToken(buildPayload(user));
    await generateAndSendVerificationCode(user.id, input.email);

    return token;
  });
};

export const startWeek = async (groupId: string) => {
  return db.transaction(async (tx) => {
    const group = await lockGroup(tx, groupId);
    if (group.status !== "pending") {
      throw new ConflictError(
        `Group is already ${group.status}`,
        "GROUP_ALREADY_STARTED",
      );
    }
    const members = await listMembers(tx, groupId);
    if (members.length < MIN_MEMBERS) {
      throw new ConflictError(
        `A susu needs at least ${MIN_MEMBERS} members to start`,
        "NOT_ENOUGH_MEMBERS",
      );
    }
    const [updated] = await tx
      .update(groups)
      .set({ status: "active", currentWeek: 1 })
      .where(eq(groups.id, groupId))
      .returning();

    return {
      ...serializeGroup(updated),
      payoutOrder: members.map((m) => ({
        week: m.position,
        userId: m.userId,
        name: m.name,
      })),
    };
  });
};

export const getReport = async (groupId: string) => {
  const group = await findGroup(db, groupId);
  const members = await listMembers(db, groupId);
  const isActive = group.status === "active";

  const balances = isActive
    ? await getWeekBalances(db, group, group.currentWeek)
    : [];
  const recipient = isActive
    ? members.find((m) => m.position === group.currentWeek)
    : undefined;

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
    .where(
      and(eq(transactions.groupId, groupId), eq(transactions.type, "payout")),
    )
    .orderBy(asc(transactions.week));

  return {
    group: serializeGroup(group),
    currentWeek: group.currentWeek,
    totalWeeks: members.length,
    currentRecipient: recipient
      ? { userId: recipient.userId, name: recipient.name }
      : null,
    paidInFull: balances
      .filter((b) => b.owes === 0)
      .map((b) => ({
        userId: b.userId,
        name: b.name,
        paid: formatGHS(b.paid),
      })),
    owing: balances
      .filter((b) => b.owes > 0)
      .map((b) => ({
        userId: b.userId,
        name: b.name,
        paid: formatGHS(b.paid),
        owes: formatGHS(b.owes),
      })),
    payoutHistory: payoutRows.map((p) => ({
      week: p.week,
      recipient: { userId: p.userId, name: p.name },
      amount: formatGHS(p.amount),
      paidOutAt: p.paidOutAt,
    })),
  };
};

export const updateGroup = async (
  groupId: string,
  input: {
    name?: string;
    weeklyAmount?: number;
    currency?: string;
    maxNumberOfMembers?: number;
    status?: "pending" | "active" | "completed";
    currentWeek?: number;
  },
) => {
  const groupExists = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });

  if (!groupExists)
    throw new NotFoundError("Group not found", "GROUP_NOT_FOUND");



  const [group] = await db
    .update(groups)
    .set(input)
    .where(eq(groups.id, groupId))
    .returning();
  return serializeGroup(group);
};

export const deleteGroup = async (groupId: string) => {
  const groupExists = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });

  if (!groupExists)
    throw new NotFoundError("Group not found", "GROUP_NOT_FOUND");

  await db.delete(groups).where(eq(groups.id, groupId));
};


