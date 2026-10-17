import type { Context } from "hono";
import * as groupsService from "./groups.service";
import type { AppEnv } from "../shared";
import { parseBody, parseUuid } from "../../utils/validate";
import { addMemberSchema, createGroupSchema } from "../../config";

type C = Context<AppEnv>;


export const createGroup = async (c: C) => {
  const body = await parseBody(c, createGroupSchema);
  const group = await groupsService.createGroup(body, c.get("user").id);
  return c.json({ data: group }, 201);
}

export const listGroup = async (c: C) => {
  const data = await groupsService.listGroups(c.get("user"));
  return c.json({ data });
}

export const getGroup = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  await groupsService.assertCanView(c.get("user"), id);
  return c.json({ data: await groupsService.getGroup(id) });
}

export const addMember = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  const { userId } = await parseBody(c, addMemberSchema);
  const member = await groupsService.addMember(id, userId);
  return c.json({ data: member }, 201);
}

export const startWeek = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  return c.json({ data: await groupsService.startWeek(id) });
}

export const getReport = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  await groupsService.assertCanView(c.get("user"), id);
  return c.json({ data: await groupsService.getReport(id) });
}

