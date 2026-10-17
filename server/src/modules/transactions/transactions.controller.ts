import type { Context } from "hono";
import * as groupsService from "../groups/groups.service";
import * as transactionsService from "./transactions.service";
import type { AppEnv } from "../shared";
import { ForbiddenError } from "../../utils/errors";
import { parseBody, parseQuery, parseUuid } from "../../utils/validate";
import { listTransactionsQuery, recordContributionSchema } from "../../config";

type C = Context<AppEnv>;


    export const recordContribution =  async (c: C) => {
        const groupId = parseUuid(c.req.param("groupId"), "groupId");
        const actor = c.get("user");
        const body = await parseBody(c, recordContributionSchema);

        if (actor.role !== "admin" && actor.id !== body.userId) {
            throw new ForbiddenError("Members can only record their own contributions");
        }

        const result = await transactionsService.recordContribution(groupId, body, actor.id);
        return c.json({ data: result }, 201);
    }

    export const closeWeek =  async (c: C) => {
        const groupId = parseUuid(c.req.param("groupId"), "groupId");
        const result = await transactionsService.closeWeek(groupId, c.get("user").id);
        return c.json({ data: result });
    }

    export const list = async (c: C) => {
        const groupId = parseUuid(c.req.param("groupId"), "groupId");
        await groupsService.assertCanView(c.get("user"), groupId);
        const filters = parseQuery(c, listTransactionsQuery);
        return c.json({ data: await transactionsService.list(groupId, filters) });
    }
