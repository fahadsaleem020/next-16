import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  reactComponentAnnotation: { enabled: true },
  org: process.env.SENTRY_ORGANIZATION,
  project: process.env.SENTRY_PROJECT,
  automaticVercelMonitors: true,
  widenClientFileUpload: true,
  silent: !process.env.CI,
  disableLogger: true,
  tunnelRoute: true,
  telemetry: false,
});
