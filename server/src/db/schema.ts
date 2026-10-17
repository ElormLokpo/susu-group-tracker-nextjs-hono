import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  index,
  text,
  timestamp,
  pgEnum,
  boolean,
  uniqueIndex,
  bigint,
  check,
  integer,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["member", "admin"]);
export const groupStatus = pgEnum("group_status", ["pending", "active", "completed"]);
export const transactionType = pgEnum("transaction_type", ["contribution", "payout"]);
const pesewas = (name: string) => bigint(name, { mode: "number" });

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: roleEnum("role").notNull().default("member"),
  oauthProvider: text("oauth_provider"),
  oauthId: text("oauth_id"),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  emailVerificationCode: text("email_verification_code"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deleteAt: timestamp("delete_at"),
});


export const groups = pgTable(
  "groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    weeklyAmount: pesewas("weekly_amount").notNull(),
    status: groupStatus("status").notNull().default("pending"),
    currentWeek: integer("current_week").notNull().default(1),
    createdBy: uuid("created_by").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("groups_weekly_amount_positive", sql`${t.weeklyAmount} > 0`)],
);


export const groupMembers = pgTable(
  "group_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id),
   
    position: integer("position").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("group_members_group_user_idx").on(t.groupId, t.userId),
    uniqueIndex("group_members_group_position_idx").on(t.groupId, t.position),
  ],
);


export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id),
    type: transactionType("type").notNull(),
    week: integer("week").notNull(),
    amount: pesewas("amount").notNull(),
    recordedBy: uuid("recorded_by").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("transactions_group_week_idx").on(t.groupId, t.week),
    check("transactions_amount_positive", sql`${t.amount} > 0`),
    uniqueIndex("transactions_one_payout_per_week_idx")
      .on(t.groupId, t.week)
      .where(sql`${t.type} = 'payout'`),
  ],
);


export type Group = typeof groups.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Member = typeof groupMembers.$inferSelect;
