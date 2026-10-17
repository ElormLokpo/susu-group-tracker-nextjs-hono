import type { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import * as authService from "./auth.services";
import { COOKIE_NAME, COOKIE_OPTIONS } from "./auth.jwt";
import {
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  Role,
} from "./auth.types";

export async function register(c: Context) {
  const { email, password, name, role } = await c.req.json<{
    email: string;
    password: string;
    name: string;
    role: Role;
  }>();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const { user, token } = await authService.registerUser(
    name,
    role,
    email,
    password,
  );

  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);
  return c.json({ user, token }, 201);
}

export async function login(c: Context) {
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  const { user, token } = await authService.loginUser(email, password);

  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);
  return c.json({ user, token });
}

export async function deleteUser(c: Context) {
  const userId = c.req.param("id");

  const deletedUser = await authService.deleteUser(userId as string, c);

  return c.json({
    message: "User soft-deleted successfully",
    user: deletedUser,
  });
}

export async function logout(c: Context) {
  deleteCookie(c, COOKIE_NAME);
  return c.json({ message: "Logged out" });
}

export async function me(c: Context) {
  const user = c.get("user");
  return c.json({ user });
}

export async function resendVerification(c: Context) {
  const user = c.get("user");
  const { email } = await c.req.json<{ email: string }>();

  const result = await authService.generateAndSendVerificationCode(
    user.id,
    email,
  );

  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }

  return c.json({ message: "Verification code sent" });
}

export async function verifyEmail(c: Context) {
  const body = await c.req.json<VerifyEmailInput>();

  const result = await authService.verifyEmailCode(body);

  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }

  return c.json({ message: "Email verified successfully", user: result.data });
}

export async function forgotPassword(c: Context) {
  const body = await c.req.json<ForgotPasswordInput>();

  await authService.requestPasswordReset(body);

  return c.json({
    message: "A reset link has been sent to email.",
  });
}

export async function resetPassword(c: Context) {
  const body = await c.req.json<ResetPasswordInput>();

  if (!body.token || !body.newPassword) {
    return c.json({ error: "Token and new password are required" }, 400);
  }

  const result = await authService.resetPassword(body);

  if (!result.success) {
    return c.json({ error: result.error }, 400);
  }

  return c.json({ message: "Password has been reset successfully" });
}

export async function googleOauth(c: Context) {
  const { name, email, email_verified } = await c.req.json<{
    name: string;
    email: string;
    email_verified: boolean;
  }>();

  const { user, token } = await authService.googleOauth({
    name,
    email,
    email_verified,
  });

  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);
  return c.json({ user, token }, 201);
}
