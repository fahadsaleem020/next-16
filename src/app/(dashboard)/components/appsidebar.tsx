"use client";

import { BookText, CircleGauge, KeyRound, LogOut, NotebookPen, Sparkles } from "lucide-react";
import Link from "next/link";

type Routes = Parameters<typeof Link>[0]["href"];

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Logo } from "@/app/shared-components/logo";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import { Spinner } from "@/ui/spinner";

interface NavData {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  url?: Routes;
  items?: NavData[];
}

const navData: NavData[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: CircleGauge,
      },
      {
        title: "Blogs",
        url: "/dashboard/blogs",
        icon: BookText,
      },
      {
        title: "Create",
        url: "/dashboard/create",
        icon: NotebookPen,
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        title: "Authentication",
        url: "/dashboard/authentication",
        icon: KeyRound,
      },
      {
        title: "OpenAI",
        url: "/dashboard/openai",
        icon: Sparkles,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const pathName = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <Link href="/dashboard">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navData.map((group, key) => (
          <SidebarGroup key={key}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items?.map((menu, key) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton tooltip={menu.title} asChild isActive={menu.url === pathName}>
                      <Link href={menu.url!}>
                        {menu.icon && <menu.icon />}
                        {menu.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button
          disabled={isLoading}
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onRequest: () => {
                  setIsLoading(true);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                  setIsLoading(false);
                },
                onSuccess: () => router.refresh(),
              },
            })
          }
        >
          {!isLoading && <LogOut />}
          logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
