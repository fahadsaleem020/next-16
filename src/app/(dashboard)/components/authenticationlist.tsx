"use client";

import { Check, KeyRound, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import type { Providers } from "@/drizzle/schema/schema";
import { useStepper } from "@/hooks/use-stepper";
import { Button } from "@/ui/button";
import { Flex } from "@/ui/flex";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/ui/item";
import { Sheet, SheetContent } from "@/ui/sheet";
import { Stack } from "@/ui/stack";
import { authProviders } from "./authentication/data";
import CredentialsForm from "./credentialsform";

type AuthenticationListProps =
  | {
      data: {
        id: string;
        provider: Providers;
        clientId: string;
        clientSecret: string;
        enabled: boolean;
      }[];
      message: string;
      error?: undefined;
    }
  | {
      error: Error;
      data?: undefined;
      message: string;
    };

export default function AuthenticationList({ awaitedData }: { awaitedData: AuthenticationListProps }) {
  const { data } = awaitedData;
  const [isOpen, setIsOpen] = useState(false);
  const { step, goToStep } = useStepper<Providers>(["Google", "GitHub", "Twitter"]);
  const activeProvider = useMemo(() => data?.find((d) => d.provider === step), [step, data]);

  return (
    <>
      <Item className="py-3">
        <ItemMedia className="rounded-full p-2 bg-secondary text-secondary-foreground border">
          <KeyRound className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-lg">Authentication Settings</ItemTitle>
          <ItemDescription>Set up login options for your platform.</ItemDescription>
        </ItemContent>
        <ItemActions className="p-0 mb-auto border rounded-md bg-secondary">
          <Flex className="py-1 gap-2 items-start p-2">
            <Shield className="size-5" />
            <Stack className="gap-0">
              <ItemTitle className="hidden md:block">Active Providers</ItemTitle>
              <ItemDescription>{data?.filter((d) => d.enabled).length}</ItemDescription>
            </Stack>
          </Flex>
        </ItemActions>
      </Item>

      <ItemGroup className="px-4">
        {authProviders.map((auth, key) => {
          const currentProvider = data?.find((p) => p.provider === auth.name);
          return (
            <Item key={key}>
              <ItemMedia>
                <auth.icon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{auth.name}</ItemTitle>
                <ItemDescription>{auth.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  onClick={() => {
                    goToStep(auth.name);
                    setIsOpen(true);
                  }}
                  size="sm"
                  variant={"outline"}
                  className={
                    currentProvider?.enabled
                      ? "dark:border-blue-500 border-blue-500 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                      : ""
                  }
                >
                  <Check />
                  {currentProvider?.enabled ? "Enabled" : "Enable"}
                </Button>
              </ItemActions>
              {key !== authProviders.length - 1 && <ItemSeparator />}
            </Item>
          );
        })}
      </ItemGroup>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent withCloseIcon={false}>
          <Stack className="bg-background h-full shadow-lg rounded-xl border">
            <CredentialsForm step={step} setIsOpenAction={setIsOpen} defaultValues={activeProvider} />
          </Stack>
        </SheetContent>
      </Sheet>
    </>
  );
}
