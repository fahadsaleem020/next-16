"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { type Dispatch, type SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { saveAuthCredentials } from "@/actions/saveauthcredentials";
import type { Providers } from "@/drizzle/schema/schema";
import { sentry } from "@/lib/sentry";
import { Button } from "@/ui/button";
import { Flex } from "@/ui/flex";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { SheetFooter, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Stack } from "@/ui/stack";
import { Switch } from "@/ui/switch";

import { authProviders, credentialsFormSchema, type ModalContent } from "./authentication/data";

type CredentialsFormSchemaSchema = z.infer<typeof credentialsFormSchema>;

export default function CredentialsForm({
  step,
  defaultValues,
  setIsOpenAction,
}: {
  step: Providers;
  setIsOpenAction: Dispatch<SetStateAction<boolean>>;
  defaultValues: (CredentialsFormSchemaSchema & { id: string }) | undefined;
}) {
  const [res, action, isPending] = useActionState(saveAuthCredentials, null);
  const content: Record<Providers, ModalContent> = {
    Twitter: { title: "Twitter", link: "https://www.better-auth.com/docs/authentication/twitter" },
    Google: { title: "Google", link: "https://www.better-auth.com/docs/authentication/google" },
    GitHub: { title: "GitHub", link: "https://www.better-auth.com/docs/authentication/github" },
  };

  const form = useForm<CredentialsFormSchemaSchema>({
    resolver: zodResolver(credentialsFormSchema),
    defaultValues: {
      clientSecret: defaultValues?.clientSecret ?? "",
      provider: defaultValues?.provider ?? step,
      enabled: defaultValues?.enabled ?? false,
      clientId: defaultValues?.clientId ?? "",
    },
  });

  useEffect(() => {
    if (res?.error) {
      sentry().captureMessage(res.message, { level: "debug", extra: res.error });
      toast.error(res.message);
    } else if (res) {
      toast.success(res?.message);
      setIsOpenAction(false);
    }
  }, [res, setIsOpenAction]);

  const onSubmit = (values: CredentialsFormSchemaSchema) => {
    const formData = new FormData();
    Object.entries(values).forEach((data) => {
      formData.append(data[0], typeof data[1] === "boolean" ? String(data[1]) : data[1]);
    });

    startTransition(async () => {
      await action(formData);
    });
  };

  return (
    <Form {...form}>
      <form className="flex-1 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <SheetHeader className="flex-row px-5 items-center mb-3">
          {authProviders.map((a, key) => (a.name === step ? <a.icon key={key} /> : null))}
          <SheetTitle>{content[step].title}</SheetTitle>
        </SheetHeader>
        <Stack className="px-5 gap-3">
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem className="sr-only">
                <FormControl>
                  <Input placeholder="Provider" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Client Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Client Secret" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <Flex className="py-3">
                  <FormLabel className="flex-1">{value ? "Enabled" : "Disabled"}</FormLabel>
                  <FormControl>
                    <Switch checked={value} onCheckedChange={(c) => onChange(c)} {...rest} />
                  </FormControl>
                </Flex>
                <FormMessage />
              </FormItem>
            )}
          />
        </Stack>
        <a
          className="flex gap-2 items-center justify-center group text-blue-500 mt-3"
          href={content[step].link}
          target="_blank"
          rel="noopener"
        >
          See instructions
          <ExternalLink className="size-4 transition-all! group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <SheetFooter className="mt-auto">
          <Button isLoading={isPending}>Submit</Button>
          <Button type="button" onClick={() => setIsOpenAction(false)} variant={"outline"}>
            Close
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
