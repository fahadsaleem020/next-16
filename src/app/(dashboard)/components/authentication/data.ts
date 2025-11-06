import { FaGithub, FaGoogle, FaTwitter } from "react-icons/fa";
import z from "zod";
import type { Providers } from "@/drizzle/schema/schema";

export type ModalContent = { title: Providers; link: string };
export interface AuthProvider {
  name: Providers;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const authProviders: AuthProvider[] = [
  {
    name: "Google",
    icon: FaGoogle,
    description: "Sign in with Google account",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    description: "Sign in with GitHub account",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    description: "Sign in with Twitter/X account",
  },
];

export const credentialsFormSchema = z.object({
  clientId: z.string().min(1, "Client Id is required."),
  clientSecret: z.string().min(1, "Client secret is required."),
  enabled: z.boolean(),
  provider: z.custom<Providers>().refine(
    (val) => {
      return typeof val === "string" && val.length > 0;
    },
    {
      message: "Provider is required.",
    },
  ),
});
