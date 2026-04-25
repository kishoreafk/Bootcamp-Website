import { drizzle } from "drizzle-orm/mysql2";
import * as relations from "../../db/relations.js";
import * as schema from "../../db/schema.js";
import { env } from "../lib/env.js";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    instance = drizzle(env.databaseUrl, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}
