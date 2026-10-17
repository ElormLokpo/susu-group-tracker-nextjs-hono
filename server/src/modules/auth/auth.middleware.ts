import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { type AppVariables, Role } from "./auth.types";
import { verifyToken } from "./auth.jwt";
import type { AppEnv } from "../shared";
import { ForbiddenError, UnauthorizedError } from "../../utils/errors";

export const authMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const cookieToken = getCookie(c, "auth_token");
    const headerToken = c.req.header("Authorization")?.replace("Bearer ", "");
    const token = cookieToken ?? headerToken;

    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const payload = await verifyToken(token);
      c.set("user", {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      });
      await next();
    } catch {
      return c.json({ error: "Invalid or expired token" }, 401);
    }
  },
);



export const requireRole = (...allowed: Role[]) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user) throw new UnauthorizedError();
    if (!allowed.includes(user.role)) {
      throw new ForbiddenError(`Requires role: ${allowed.join(" or ")}`);
    }
    await next();
  });

