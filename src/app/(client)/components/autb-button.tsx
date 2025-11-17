"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useStepper } from "@/hooks/use-stepper";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/providers/user.provider";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/dialog";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";

export type FormTypes = "signin" | "signup";
type ModalContent = { title: string; description: string; content: React.ReactNode };

export default function AuthButton() {
  const { step, goToStep } = useStepper<FormTypes>(["signin", "signup"]);
  const { data, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const content: Record<FormTypes, ModalContent> = {
    signin: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      content: <SignInForm setIsOpen={setIsOpen} withModal goToStep={goToStep} />,
    },
    signup: {
      title: "Create an account",
      description: "Enter your information below to create your account",
      content: <SignUpForm withModal goToStep={goToStep} setIsOpen={setIsOpen} />,
    },
  };

  if (isLoading) return <Button className="animate-pulse pointer-events-none">Account</Button>;

  return (
    <>
      {!data && <Button onClick={() => setIsOpen(true)}>Account</Button>}
      {data && (
        <Button
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
              },
            });
          }}
        >
          Logout
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{content[step].title}</DialogTitle>
            <DialogDescription>{content[step].description}</DialogDescription>
          </DialogHeader>
          {content[step].content}
        </DialogContent>
      </Dialog>
    </>
  );
}
