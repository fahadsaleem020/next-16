import * as sentryNextJs from "@sentry/nextjs";

type Sentry = typeof sentryNextJs;

// Extract only the keys that point to functions
type FunctionKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// Define chainable type only for function keys
type Chainable = {
  [K in FunctionKeys<Sentry>]: (...args: Parameters<Sentry[K]>) => Chainable;
} & {
  throw: (message: string) => never;
};

export const sentry = (): Chainable => {
  const wrapped = {} as Chainable;

  // Use Object.entries to safely iterate
  for (const [key, value] of Object.entries(sentryNextJs)) {
    if (typeof value === "function") {
      // @ts-expect-error: We're intentionally overriding function members
      wrapped[key] = (...args: any[]) => {
        (value as (...args: any[]) => any)(...args);
        return sentry();
      };
    }
  }

  wrapped.throw = (message): never => {
    throw new Error(message);
  };

  return wrapped;
};
