import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  schema: "./src/drizzle/schema/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  casing: "snake_case",
  verbose: true,
  strict: true,
});
