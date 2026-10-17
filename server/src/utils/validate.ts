import type { Context } from "hono";
import { z } from "zod";
import { ValidationError } from "./errors";

export async function parseBody<T extends z.ZodTypeAny>(c: Context, schema: T): Promise<z.output<T>> {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
  return schema.parse(raw);
}

export function parseQuery<T extends z.ZodTypeAny>(c: Context, schema: T): z.output<T> {
  return schema.parse(c.req.query());
}

const uuid = z.string().uuid();

export function parseUuid(value: string | undefined, name: string): string {
  const result = uuid.safeParse(value);
  if (!result.success) throw new ValidationError(`${name} must be a valid UUID`);
  return result.data;
}
