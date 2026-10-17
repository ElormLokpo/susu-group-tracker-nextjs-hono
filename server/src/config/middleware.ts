import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import { parseError } from "./";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodTypeAny } from "zod";

export function errorMiddleware(err: unknown, c: Context) {
  const { status, body } = parseError(err);
  return c.json(body, status as ContentfulStatusCode);
}

declare module "hono" {
  interface ContextVariableMap {
    validatedBody: unknown;
  }
}

export function zValidator<T extends ZodTypeAny>(schema: T) {
  return createMiddleware(async (c, next) => {
    const body = await c.req.json();
    const parsed = await schema.parseAsync(body);
    c.set("validatedBody", parsed);
    await next();
  });
}

export function getValidatedBody<T>(
  c: Parameters<typeof createMiddleware>[0],
): T {
  return c.get("validatedBody") as T;
}
