import { Hono } from "hono";
import * as groupsController from "./groups.controller";
import { authMiddleware, requireRole } from "../auth/auth.middleware";
import type { AppEnv } from "../shared";
import { Role } from "../auth/auth.types";

export const groupsRoutes = new Hono<AppEnv>();

groupsRoutes.post(
  "/",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  groupsController.createGroup,
);
groupsRoutes.get(
  "/",
  authMiddleware,
  requireRole([Role.admin]),
  groupsController.listGroup,
);
groupsRoutes.get(
  "/:id",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  groupsController.getGroup,
);

groupsRoutes.post("/members/join", groupsController.joinGroup);

groupsRoutes.post(
  "/:id/start",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  groupsController.startWeek,
);
groupsRoutes.get(
  "/:id/report",
  authMiddleware,
  requireRole([Role.admin, Role.member]),
  groupsController.getReport,
);

groupsRoutes.patch(
  "/:id",
  authMiddleware,
  requireRole([Role.admin]),
  groupsController.updateGroup,
);

groupsRoutes.delete(
  "/:id",
  authMiddleware,
  requireRole([Role.admin]),
  groupsController.deleteGroup,
);
