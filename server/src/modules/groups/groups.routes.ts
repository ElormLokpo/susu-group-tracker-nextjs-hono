import { Hono } from "hono";
import * as groupsController from "./groups.controller";
import { requireRole } from "../auth/auth.middleware";
import type { AppEnv } from "../shared";

export const groupsRoutes = new Hono<AppEnv>();

groupsRoutes.post("/", requireRole("admin"), groupsController.createGroup);
groupsRoutes.get("/", requireRole("admin", "member"), groupsController.listGroup);
groupsRoutes.get("/:id", requireRole("admin", "member"), groupsController.getGroup);
groupsRoutes.post("/:id/members", requireRole("admin"), groupsController.addMember);
groupsRoutes.post("/:id/start", requireRole("admin"), groupsController.startWeek);
groupsRoutes.get("/:id/report", requireRole("admin", "member"), groupsController.getReport);
