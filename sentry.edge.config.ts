import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableLogs: true,
  debug: false,
  sendDefaultPii: true,
  ...(process.env.NODE_ENV !== "production"
    ? {
        integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })],
      }
    : {}),
});
