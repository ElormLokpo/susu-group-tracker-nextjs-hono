import bcrypt from "bcryptjs";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { users, type NewUser, type User } from "../../db/schema";
import {
  JWTPayload,
  VerifyEmailInput,
  ServiceResult,
  ForgotPasswordInput,
  ResetPasswordInput,
  Role,
  CODE_EXPIRY_MINUTES,
  RESET_TOKEN_EXPIRY_MINUTES,
  FRONTEND_RESET_URL,
  OauthRequest,
} from "./auth.types";
import { signToken } from "./auth.jwt";
import { Context } from "hono";
import { randomBytes, randomInt } from "crypto";
import { sendEmail } from "../../config";

export async function registerUser(
  name: string,
  role: Role,
  email: string,
  password: string,
) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role: role ?? "user",
      name,
    } satisfies NewUser)
    .returning();

  const token = await signToken(buildPayload(user));
  await generateAndSendVerificationCode(user.id, email);

  return { user: sanitize(user), token };
}

export async function loginUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.passwordHash) {
    throw new Error("Invalid credentials");
  }

  if (user.deleteAt) {
    throw new Error("Account has been deleted");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const token = await signToken(buildPayload(user));
  return { user: sanitize(user), token };
}

export async function findOrCreateOAuthUser(
  email: string,
  oauthId: string,
  provider: "google",
) {
  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    [user] = await db
      .insert(users)
      .values({ email, oauthProvider: provider, oauthId, role: "user" })
      .returning();
  }

  const token = await signToken(buildPayload(user));
  return { user: sanitize(user), token };
}

export async function deleteUser(userId: string, c: Context) {
  const [softDeletedUser] = await db
    .update(users)
    .set({
      deleteAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(users.id, userId), isNull(users.deleteAt)))
    .returning();

  if (!softDeletedUser) {
    return c.json({ error: "User not found or already deleted" }, 404);
  }

  return softDeletedUser;
}

function buildPayload(user: User): JWTPayload {
  return { sub: user.id, email: user.email, role: user.role as Role };
}

function sanitize(user: User) {
  const {
    passwordHash,
    oauthId,
    oauthProvider,
    createdAt,
    updatedAt,
    deleteAt,
    emailVerificationCode,
    emailVerificationExpires,
    passwordResetToken,
    passwordResetExpires,
    ...safe
  } = user;

  void passwordResetToken;
  void passwordResetExpires;
  void emailVerificationCode;
  void emailVerificationExpires;
  void oauthId;
  void oauthProvider;
  void createdAt;
  void updatedAt;
  void deleteAt;
  void passwordHash;

  return safe;
}

export async function generateAndSendVerificationCode(
  userId: string,
  email: string,
): Promise<ServiceResult> {
  const code = randomInt(100000, 999999).toString();
  const hashedCode = await bcrypt.hash(code, 10);
  const expires = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  await db
    .update(users)
    .set({
      emailVerificationCode: hashedCode,
      emailVerificationExpires: expires,
    })
    .where(eq(users.id, userId));

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code expires in ${CODE_EXPIRY_MINUTES} minutes.</p>
    `,
  });

  return { success: true };
}

export async function verifyEmailCode(input: VerifyEmailInput) {
  const { email, code } = input;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return { success: false, error: "Invalid email or code", status: 400 };
  }

  if (user.isEmailVerified) {
    return { success: false, error: "Email already verified", status: 400 };
  }

  if (
    !user.emailVerificationCode ||
    !user.emailVerificationExpires ||
    user.emailVerificationExpires < new Date()
  ) {
    return { success: false, error: "Code expired or invalid", status: 400 };
  }

  const isValid = await bcrypt.compare(code, user.emailVerificationCode);
  if (!isValid) {
    return { success: false, error: "Invalid code", status: 400 };
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    })
    .where(eq(users.id, user.id))
    .returning();

  return { success: true, data: sanitize(updatedUser) };
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const email = input.email.toLowerCase();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { success: false, message: "User not found", status: 404 };
  }

  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(rawToken, 10);
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await db
    .update(users)
    .set({
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    })
    .where(eq(users.id, user.id));

  const resetLink = `${FRONTEND_RESET_URL}?token=${rawToken}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in ${RESET_TOKEN_EXPIRY_MINUTES} minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });

  return { success: true };
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<ServiceResult> {
  const { token, newPassword, email } = input;

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters",
      status: 400,
    };
  }

  const usersWithToken = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));

  let matchedUser = null;

  for (const user of usersWithToken) {
    if (
      user.passwordResetToken &&
      user.passwordResetExpires &&
      user.passwordResetExpires > new Date()
    ) {
      const isMatch = await bcrypt.compare(token, user.passwordResetToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }
  }

  if (!matchedUser) {
    return {
      success: false,
      error: "Invalid or expired reset token",
      status: 400,
    };
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  await db
    .update(users)
    .set({
      passwordHash: newHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    })
    .where(eq(users.id, matchedUser.id));

  return { success: true };
}

export async function googleOauth(oauthData: OauthRequest) {
  const { name, email, email_verified } = oauthData;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    const token = await signToken(buildPayload(existingUser));

    return { success: true, user: sanitize(existingUser), token };
  }

  const [user] = await db
    .insert(users)
    .values({
      email,
      oauthProvider: "google",
      isEmailVerified: email_verified,
      role: "user",
      name,
    } satisfies NewUser)
    .returning();

  const token = await signToken(buildPayload(user));
  return { success: true, user: sanitize(user), token };
}
