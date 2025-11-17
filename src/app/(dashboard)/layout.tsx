import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/getsession";
import { UserProvider } from "@/providers/user.provider";
import { SidebarInset, SidebarProvider } from "@/ui/sidebar";
import { AppSidebar } from "./components/appsidebar";
import AppSidebarHeaer from "./components/appsidebarheader";

export const metadata: Metadata = {
  title: "dashboard",
};

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();

  if (session?.user.role !== "admin") redirect("/");

  return (
    <UserProvider initialSession={session}>
      <SidebarProvider className="h-screen">
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <AppSidebarHeaer />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
