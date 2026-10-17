import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
export * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Executor = typeof db | Tx;
