import { KeyRound, Shield } from "lucide-react";
import { Flex } from "@/ui/flex";
import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/ui/item";
import { Skeleton } from "@/ui/skeleton";
import { Stack } from "@/ui/stack";

export default function Loading() {
  return (
    <>
      <Item className="py-3">
        <ItemMedia className="rounded-full p-2 bg-secondary text-secondary-foreground border">
          <KeyRound className="size-5 opacity-30" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-lg">
            <Skeleton className="h-5 w-48" />
          </ItemTitle>
          <Skeleton className="h-4 w-64 mt-1" />
        </ItemContent>
        <ItemActions className="p-0 mb-auto border rounded-md bg-secondary">
          <Flex className="py-1 gap-2 items-start p-2">
            <Shield className="size-5 opacity-30" />
            <Stack className="gap-0">
              <ItemTitle className="hidden md:block">
                <Skeleton className="h-4 w-28" />
              </ItemTitle>

              <Skeleton className="h-4 w-8 mt-1" />
            </Stack>
          </Flex>
        </ItemActions>
      </Item>
      <ItemGroup className="px-4">
        {Array.from({ length: 3 }).map((_, key) => (
          <div key={key}>
            <Item>
              <ItemMedia>
                <Skeleton className="h-5 w-5 rounded-full" />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>
                  <Skeleton className="h-4 w-20" />
                </ItemTitle>

                <Skeleton className="h-3 w-40 mt-1" />
              </ItemContent>

              <ItemActions>
                <Skeleton className="h-8 w-24 rounded-md" />
              </ItemActions>
            </Item>

            {key !== 2 && <ItemSeparator />}
          </div>
        ))}
      </ItemGroup>
    </>
  );
}
