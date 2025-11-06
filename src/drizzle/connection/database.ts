import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../schema/schema";

// Create the PG client
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Extend globalThis with a typed field
type GlobalWithDrizzle = typeof globalThis & {
  __drizzle__: ReturnType<typeof drizzle<typeof schema>>;
};

const globalForDrizzle = globalThis as GlobalWithDrizzle;

// Reuse existing instance or create a new one
const database = globalForDrizzle.__drizzle__ ?? drizzle({ client, schema });

// Store in globalThis only in development
if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.__drizzle__ = database;
}

export { database };
