import { migrate } from "drizzle-orm/node-postgres/migrator";
import { database } from "@/drizzle/connection/database";

try {
  await migrate(database, { migrationsFolder: "src/drizzle/migrations" });
  console.log("migration successful");
} catch (e) {
  const error = e as Error;
  console.log(`migration failure: ${error.message}`);
}
