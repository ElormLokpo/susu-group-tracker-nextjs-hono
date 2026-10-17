import {
  pgTable,
  uuid,
  index,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["member", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: roleEnum("role").notNull().default("user"),
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


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

