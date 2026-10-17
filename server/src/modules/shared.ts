import { and, asc, eq, sql } from "drizzle-orm";
import type { Executor, Tx } from "../db";
import { type Group, type Transaction, groupMembers, groups, transactions, users } from "../db/schema";
import { NotFoundError } from "../utils/errors";
import { CURRENCY, formatGHS } from "../utils/money";
import { AuthUser } from "./auth/auth.types";

export type AppEnv = {
  Variables: {
    user: AuthUser;
  };
};


export async function lockGroup(tx: Tx, groupId: string): Promise<Group> {
  const [group] = await tx.select().from(groups).where(eq(groups.id, groupId)).for("update");
  if (!group) throw new NotFoundError("Group not found", "GROUP_NOT_FOUND");
  return group;
}

export async function findGroup(ex: Executor, groupId: string): Promise<Group> {
  const [group] = await ex.select().from(groups).where(eq(groups.id, groupId)).limit(1);
  if (!group) throw new NotFoundError("Group not found", "GROUP_NOT_FOUND");
  return group;
}

export async function listMembers(ex: Executor, groupId: string) {
  return ex
    .select({
      userId: groupMembers.userId,
      name: users.name,
      position: groupMembers.position,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(users, eq(users.id, groupMembers.userId))
    .where(eq(groupMembers.groupId, groupId))
    .orderBy(asc(groupMembers.position));
}


export async function getWeekBalances(ex: Executor, group: Group, week: number) {
  const members = await listMembers(ex, group.id);
  const paidRows = await ex
    .select({
      userId: transactions.userId,
      paid: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.groupId, group.id),
        eq(transactions.type, "contribution"),
        eq(transactions.week, week),
      ),
    )
    .groupBy(transactions.userId);

  const paidByUser = new Map(paidRows.map((r) => [r.userId, Number(r.paid)]));

  return members.map((m) => {
    const paid = paidByUser.get(m.userId) ?? 0;
    return { ...m, paid, owes: group.weeklyAmount - paid };
  });
}

export function serializeGroup(g: Group) {
  return {
    id: g.id,
    name: g.name,
    weeklyAmount: formatGHS(g.weeklyAmount),
    currency: CURRENCY,
    status: g.status,
    currentWeek: g.currentWeek,
    createdBy: g.createdBy,
    createdAt: g.createdAt,
  };
}

export function serializeTransaction(t: Transaction) {
  return {
    id: t.id,
    groupId: t.groupId,
    userId: t.userId,
    type: t.type,
    week: t.week,
    amount: formatGHS(t.amount),
    currency: CURRENCY,
    recordedBy: t.recordedBy,
    createdAt: t.createdAt,
  };
}
