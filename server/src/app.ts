import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { env, errorMiddleware } from "./config";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { auth as authRoutes } from "./modules/auth/auth.routes";
import { groupsRoutes } from "./modules/groups/groups.routes"
import { transactionsRoutes } from "./modules/transactions/transactions.routes"

export const createApp = () => {
  const app = new Hono().basePath("/api/v1");

  app.use("*", logger());
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) return undefined;

        return env.ALLOWED_DOMAINS.includes(origin) ? origin : undefined;
      },
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );

  app.all("/health", async (c: Context) => {
    try {
      await db.execute(sql`SELECT 1`);
      return c.json({ message: "Database ping successful" }, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: "Database ping unsucessful" }, 500);
    }
  });

  app.route("/auth", authRoutes);
  app.route("/groups", groupsRoutes);
  app.route("/transactions", transactionsRoutes)

  app.onError(errorMiddleware);

  return app;
};

export type App = ReturnType<typeof createApp>;
