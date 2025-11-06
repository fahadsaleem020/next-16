"use client";

import type { BetterFetchError } from "better-auth/react";
import { createContext, type FC, type PropsWithChildren, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { sentry } from "@/lib/sentry";

export type Session = typeof authClient.$Infer.Session;

interface ContextData {
  refetchUser: () => void;
  isLoading: boolean;
  data: Session | null;
}

interface BeterAuthProviderProps extends PropsWithChildren {
  /**
   * @type boolean
   * @default false
   * @description periodically fetches user if server throws error while fetching session, should be used for development reason.
   */
  refetchOnError?: boolean;
  /**
   * @type function
   * @param error BetterFetchError
   * @returns void
   * @description contains session error.
   */
  onError?: (error: BetterFetchError) => void;
  initialSession?: Session | null;
}

const UserAuthContext = createContext<ContextData>({} as any);

/**
 * UserProvider supplies authentication and user session context to the application.
 *
 * This provider manages user state, session, and loading status, and should wrap your app at the top level
 * (e.g., in App.tsx or main layout) to ensure all components have access to user context via useUser().
 *
 * @example
 *   <UserProvider>
 *     <App />
 *   </UserProvider>
 *
 * Must be used at the top level of your React component tree.
 */
export const UserProvider: FC<BeterAuthProviderProps> = ({ onError, children, initialSession = null, refetchOnError = false }) => {
  const { data: sessionData, isPending, error, refetch } = authClient.useSession();
  const [data, setData] = useState<Session | null>(initialSession ? initialSession : null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const refetchUser = refetch;

  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
      return;
    }
    if (sessionData) {
      setData(sessionData);

      // optional sentry stuff
      sentry().setUser({
        id: sessionData.user.id,
        email: sessionData.user.email,
        username: sessionData.user.username ?? undefined,
      });
      // optional sentry stuff

      setIsLoading(false);
    } else {
      setData(null);
      setIsLoading(false);
    }
    if (error) {
      onError?.(error);
      if (refetchOnError) {
        setTimeout(() => {
          refetchUser();
        }, 1000);
      }
    }
  }, [sessionData, isPending, error, onError, refetchOnError, refetchUser]);

  return (
    <UserAuthContext.Provider
      value={{
        data,
        isLoading,
        refetchUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

/**
 * useUser is a custom hook that provides access to the current user, session, loading state, and a refetch function.
 *
 * Must be used within a UserProvider.
 *
 * @example
 *   const { data, isLoading, refetchUser } = useUser();
 *   if (isLoading) return <div>Loading...</div>;
 *   if (data?.user) return <div>Hello, {data.user.name}!</div>;
 *
 */
export const useUser = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("userUser must be used within a UserProvider");
  }
  return context;
};
