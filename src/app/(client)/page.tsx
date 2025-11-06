"use client";

import { authClient } from "@/lib/auth-client";

export default function HomePage() {
  const { data } = authClient.useSession();
  return <h1>client page {data?.user.email}</h1>;
}
