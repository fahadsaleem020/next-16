import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_MONITORING === "enabled")
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [Sentry.replayIntegration()],
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
    sendDefaultPii: true,
    ...(process.env.NODE_ENV !== "production"
      ? {
          integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }), Sentry.browserTracingIntegration()],
        }
      : {}),
  });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
