import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { type AppVariables, Role } from "./auth.types";
import { verifyToken } from "./auth.jwt";

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

export function requireRole(...roles: Role[]) {
  return createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!roles.includes(user.role)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await next();
  });
}
