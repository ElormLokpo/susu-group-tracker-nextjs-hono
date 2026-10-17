import { env } from "../../config";

export type Role = "user" | "admin" | undefined;

export interface JWTPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface AppVariables {
  user: AuthUser;
}

export type VerifyEmailInput = {
  email: string;
  code: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
  email: string;
};

export type ServiceResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; status?: number };

export const RESET_TOKEN_EXPIRY_MINUTES = 30;
export const FRONTEND_RESET_URL =
  env.NODE_ENV === "production"
    ? env.FRONTEND_URL_PROD
    : env.FRONTEND_URL_LOCAL + "/auth/reset-password";
export const CODE_EXPIRY_MINUTES = 15;

export type OauthRequest = {
  name: string;
  email: string;
  email_verified: boolean;
};
