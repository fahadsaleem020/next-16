"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { database } from "@/drizzle/connection/database";
import { sentry } from "@/lib/sentry";

export async function getAutheCredentials() {
  cacheTag("auth-creds");
  cacheLife({
    stale: 60 * 60 * 24,
    revalidate: 60 * 60 * 24 * 365,
    expire: 60 * 60 * 24 * 366,
  });

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
