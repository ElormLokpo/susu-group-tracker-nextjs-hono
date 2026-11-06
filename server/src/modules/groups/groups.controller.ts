import type { Context } from "hono";
import * as groupsService from "./groups.service";
import type { AppEnv } from "../shared";
import { parseBody, parseUuid } from "../../utils/validate";
import { createGroupSchema, joinGroupSchema, updateGroupSchema } from "../../config";

type C = Context<AppEnv>;

export const createGroup = async (c: C) => {
  const body = await parseBody(c, createGroupSchema);
  const group = await groupsService.createGroup(body, c.get("user").id);
  return c.json({ data: group }, 201);
};

export const listGroup = async (c: C) => {
  // const data = await groupsService.listGroups(c.get("user"));
  const data = await groupsService.listGroups();

  return c.json({ data });
};

export const getGroup = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  await groupsService.assertCanView(c.get("user"), id);
  return c.json({ data: await groupsService.getGroup(id) });
};

export const joinGroup = async (c: C) => {
  const { inviteId, name, email, password, role } = await parseBody(
    c,
    joinGroupSchema,
  );
  const token = await groupsService.joinGroup({
    inviteId,
    name,
    email,
    password,
    role,
  });
  return c.json({ data: { token } });
};

export const startWeek = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  return c.json({ data: await groupsService.startWeek(id) });
};

export const getReport = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  await groupsService.assertCanView(c.get("user"), id);
  return c.json({ data: await groupsService.getReport(id) });
};

export const updateGroup = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  const body = await parseBody(c, updateGroupSchema);
  const group = await groupsService.updateGroup(id, body);
  return c.json({ data: group });
};

export const deleteGroup = async (c: C) => {
  const id = parseUuid(c.req.param("id"), "id");
  await groupsService.deleteGroup(id);
  return c.json({ data: { message: "Group deleted successfully" } });
};
