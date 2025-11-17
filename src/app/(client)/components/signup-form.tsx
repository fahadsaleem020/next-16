"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { UseStepper } from "@/hooks/use-stepper";
import { authClient } from "@/lib/auth-client";
import { Box } from "@/ui/box";
import { Button } from "@/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import type { FormTypes } from "./autb-button";

type WithModal = {
  withModal: true;
  goToStep: UseStepper<FormTypes>["goToStep"];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type WithoutModal = {
  withModal?: false;
  setIsOpen?: never;
  goToStep?: never;
};

const signUpSchema = z
  .object({
    displayUsername: z.optional(z.string().max(25, "Maximum 25 characters.")),
    email: z.email("Please enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export const SignUpForm = ({ withModal = false, goToStep, setIsOpen }: WithModal | WithoutModal) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayUsername: "",
    },
  });

  const onSubmit = ({ email, password, displayUsername }: SignUpSchema) => {
    const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

    const username = `${sanitize(email.split("@")[0].toLowerCase())}_${init({ length: 6 })()}`;
    const name = sanitize(email.split("@")[0].toLowerCase());

    authClient.signUp.email(
      { email, password, displayUsername: displayUsername?.length ? displayUsername : name, name, username },
      {
        onRequest: () => setIsPending(true),
        onSuccess: () => {
          setIsPending(false);
          toast.success(`Welcome ${name}`);
          setIsOpen?.(false);
        },
        onError: (ctx) => {
          setIsPending(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="displayUsername"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>This will be your display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="m@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>We'll use this to contact you. We won’t share it with anyone.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormDescription>Must be at least 6 characters long.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Confirm password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="lg" type="submit" disabled={isPending}>
          {isPending ? "Almost there..." : "Create Account"}
        </Button>

        <Box className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          {withModal ? (
            <Button type="button" variant="link" className="p-0 h-0" onClick={() => goToStep?.("signin")}>
              Sign in
            </Button>
          ) : (
            <Button type="button" variant="link" className="p-0 h-0">
              <Link href="/signin" className="underline">
                Sign in
              </Link>
            </Button>
          )}
        </Box>
      </form>
    </Form>
  );
};
