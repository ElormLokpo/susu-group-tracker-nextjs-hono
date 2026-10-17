import { Hono } from "hono";
import * as authController from "./auth.controller";
import { type AppVariables } from "./auth.types";
import { authMiddleware, requireRole } from "./auth.middleware";

import {
  loginSchema,
  registerSchema,
  emailSchema,
  verifyEmailSchema,
  zValidator,
  resetPasswordSchema,
} from "../../config";

export const auth = new Hono<{ Variables: AppVariables }>();

auth.post("/register", zValidator(registerSchema), authController.register);
auth.post("/login", zValidator(loginSchema), authController.login);
auth.post("/logout", authController.logout);
auth.get("/me", authMiddleware, authController.me);

auth.post(
  "/verify-email",
  zValidator(verifyEmailSchema),
  authMiddleware,
  authController.verifyEmail,
);
auth.post(
  "/resend-verification",
  zValidator(emailSchema),
  authMiddleware,
  authController.resendVerification,
);

auth.post(
  "/forgot-password",
  zValidator(emailSchema),
  authController.forgotPassword,
);
auth.post(
  "/reset-password",
  zValidator(resetPasswordSchema),
  authController.resetPassword,
);

auth.delete(
  "/delete-user/:id",
  authMiddleware,
  requireRole("admin"),
  authController.deleteUser,
);

auth.post("/google-oauth", authController.googleOauth);
