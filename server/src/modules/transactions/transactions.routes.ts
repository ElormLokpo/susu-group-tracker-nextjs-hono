import { Hono } from "hono";
import * as transactionsController from "./transactions.controller";
import { authMiddleware, requireRole } from "../auth/auth.middleware";
import type { AppEnv } from "../shared";
import { Role } from "../auth/auth.types";

export const transactionsRoutes = new Hono<AppEnv>();

transactionsRoutes.all(
  "/all",
  authMiddleware,
  requireRole([Role.admin]),
  transactionsController.all,
);
transactionsRoutes.post(
  "/groups/:groupId/contributions",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  transactionsController.recordContribution,
);
transactionsRoutes.post(
  "/groups/:groupId/close-week",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  transactionsController.closeWeek,
);
transactionsRoutes.get(
  "/groups/:groupId/transactions",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  transactionsController.list,
);
