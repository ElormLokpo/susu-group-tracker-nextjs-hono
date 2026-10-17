import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "./auth.types";
import { env } from "../../config";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const EXPIRES_IN = "7d";

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as JWTPayload;
}

export const COOKIE_NAME = "auth_token";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  maxAge: 60 * 60 * 24 * 7,
};
