"use server";
import "server-only";

import { refresh, revalidatePath, revalidateTag, updateTag } from "next/cache";
import { z } from "zod";
import { credentialsFormSchema } from "@/app/(dashboard)/components/authentication/data";
import { database } from "@/drizzle/connection/database";
import { authentication, type Providers } from "@/drizzle/schema/schema";
import { sentry } from "@/lib/sentry";

export async function saveAuthCredentials(_initialState: unknown, formData: FormData) {
  sentry().addBreadcrumb({
    message: `saveAuthCredentials triggerd`,
    category: "before database operation",
    level: "info",
    type: "info",
  });

  const values = {
    clientSecret: formData.get("clientSecret") as string | undefined,
    provider: formData.get("provider") as Providers | undefined,
    clientId: formData.get("clientId") as string | undefined,
    enabled: (formData.get("enabled") as string) === "true" ? true : false,
  };

  const validatedFields = credentialsFormSchema.safeParse(values);
  if (!validatedFields.success) {
    sentry().addBreadcrumb({
      message: `Zod validation failed.`,
      category: "before database operation",
      data: z.treeifyError(validatedFields.error).properties,
      level: "error",
      type: "info",
    });
    return { message: "Validation failed.", error: z.treeifyError(validatedFields.error).properties };
  }

  const res = await database.insert(authentication).values(validatedFields.data).onConflictDoUpdate({
    target: authentication.provider,
    set: validatedFields.data,
  });

  if (res.rowCount) {
    updateTag("auth-creds");
    revalidatePath("/dashboard/authentication");
    revalidateTag("auth-creds", { expire: 300 });
    refresh();

    return { message: `Record added for ${validatedFields.data.provider}.` };
  }

  sentry().addBreadcrumb({
    message: `Failed to execute database query`,
    category: "after database operation",
    level: "fatal",
    type: "error",
  });

  throw new Error("Failed to add record.");
}
