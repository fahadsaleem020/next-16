import * as Sentry from "@sentry/nextjs";

export async function register() {
  const isSentryEnabled = process.env.NEXT_PUBLIC_SENTRY_MONITORING === "enabled";
  const isRunTimeNode = process.env.NEXT_RUNTIME === "nodejs";
  const isRunTimeEdge = process.env.NEXT_RUNTIME === "edge";

  if (isRunTimeNode) await import("./drizzle/utils/migrate");
  if (isSentryEnabled && isRunTimeEdge) await import("../sentry.edge.config");
  if (isSentryEnabled && isRunTimeNode) await import("../sentry.server.config");
}

export const onRequestError = Sentry.captureRequestError;
