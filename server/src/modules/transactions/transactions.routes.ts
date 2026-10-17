import { Hono } from "hono";
import * as transactionsController from "./transactions.controller";
import { requireRole } from "../auth/auth.middleware";
import type { AppEnv } from "../shared";


export const transactionsRoutes = new Hono<AppEnv>();

transactionsRoutes.post(
    "/groups/:groupId/contributions",
    requireRole("admin", "member"),
    transactionsController.recordContribution,
);
transactionsRoutes.post("/groups/:groupId/close-week", requireRole("admin"), transactionsController.closeWeek);
transactionsRoutes.get(
    "/groups/:groupId/transactions",
    requireRole("admin", "member"),
    transactionsController.list,
);
