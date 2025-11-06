import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { UseStepper } from "@/hooks/use-stepper";
import { authClient } from "@/lib/auth-client";
import { Box } from "@/ui/box";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import type { FormTypes } from "../layout";

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

const signInSchema = z.object({
  email: z.email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignInSchema = z.infer<typeof signInSchema>;

export const SignInForm: FC<WithModal | WithoutModal> = ({ withModal = false, goToStep, setIsOpen }) => {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }: SignInSchema) => {
    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => setIsPending(true),
        onSuccess: () => {
          setIsPending(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="m@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-fit ml-auto text-sm" asChild>
                <a href={"/forgot-password"}>Forgot Password?</a>
              </FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="lg" type="submit" disabled={isPending}>
          {isPending ? "Just a sec..." : "Sign In"}
        </Button>

        <Box className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          {withModal ? (
            <Button type="button" variant="link" className="p-0 h-0" onClick={() => goToStep?.("signup")}>
              Sign up
            </Button>
          ) : (
            <a href="/signup" className="underline">
              Sign up
            </a>
          )}
        </Box>
      </form>
    </Form>
  );
};
