import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, createAuthMiddleware, username } from "better-auth/plugins";
import { database } from "@/drizzle/connection/database";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/email" && ctx.context.newSession) {
        ctx.context.newSession.user;
        return ctx.context.newSession;
      }
    }),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days ( session expiry )
    updateAge: 60 * 60 * 24, // 1 day( "expiresIn = now + expiry" after every updateAge time, if session is used )
  },
  advanced: {
    useSecureCookies: isProduction, // required for HTTPS domains
    cookies: {
      session_token: {
        attributes: {
          sameSite: isProduction ? "none" : "lax", // 'lax' for dev, 'none' for prod
          httpOnly: isProduction, // false for dev, true for prod
          secure: isProduction, // false for dev, true for prod
        },
      },
    },
  },
  plugins: [username(), admin()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});
