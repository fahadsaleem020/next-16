"use client";

import { BookText, CircleGauge, KeyRound, LogOut, NotebookPen } from "lucide-react";
import Link from "next/link";

type Routes = Parameters<typeof Link>[0]["href"];

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Logo } from "@/app/shared-components/logo";
import { authClient } from "@/lib/auth-client";
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
    title: "Settings",
    items: [
      {
        title: "Authentication Providers",
        url: "/dashboard/authentication",
        icon: KeyRound,
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
                      <Link prefetch={menu.url !== "/dashboard/authentication"} href={menu.url!}>
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
        <SidebarMenu>
          <SidebarMenuItem className="border rounded-md">
            <SidebarMenuButton
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
              <LogOut />
              logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
