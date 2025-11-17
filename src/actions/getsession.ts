"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";

export type GetSessionReturnType = ReturnType<typeof getSession>;

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
