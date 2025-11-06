"use server";

import { cacheLife, cacheTag } from "next/cache";
import { database } from "@/drizzle/connection/database";
import { sentry } from "@/lib/sentry";

export async function getAutheCredentials() {
  "use cache";
  cacheLife({
    stale: 1,
    revalidate: 5,
    expire: 1 * 60 * 60,
  });
  cacheTag("auth-creds");

  try {
    const res = await database.query.authentication.findMany();
    return { data: res, message: "records found" };
  } catch (e) {
    const error = e as Error;
    sentry().addBreadcrumb({
      message: `Failed to execute database query`,
      category: "after database operation",
      level: "fatal",
      type: "error",
    });
    return { error, message: error.message };
  }
}
