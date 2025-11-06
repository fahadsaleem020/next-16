"use client";

import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ToggleTheme } from "@/app/shared-components/togglebuttone";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/ui/breadcrumb";
import { SidebarTrigger } from "@/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "@/utils/cn";

type Routes = Parameters<typeof Link>[0]["href"];

const convertToLink = (crumbs: string[], crumb: string) => `/${crumbs.slice(0, crumbs.indexOf(crumb) + 1).join("/")}` as Routes;
const removeParmaLinksFromPathName = (crumbs: string[]) => crumbs.filter((c) => !isParmaLink(c));
const isLastCrumb = (crumbs: string[], crumb: string) => crumb === crumbs.at(-1);
const isParmaLink = (link: string) => link.includes("-");

export default function AppSidebarHeader() {
  return (
    <header className="flex min-h-16 px-4 items-center gap-2 border-b">
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger />
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Sidebar</p>
        </TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mr-2 h-4 border-r border-ring" />
      <PathAwarness />
      <ToggleTheme className="ml-auto" />
    </header>
  );
}

const PathAwarness = () => {
  const pathName = usePathname();
  const crumbs = pathName.split("/").slice(1);
  const sanitizedCrumbs = removeParmaLinksFromPathName(crumbs);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {sanitizedCrumbs.map((crumb, key, sc) => (
          <React.Fragment key={key}>
            <BreadcrumbSeparator className={cn(key === 0 && "hidden")} />
            {!isLastCrumb(sanitizedCrumbs, crumb) ? (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={convertToLink(sc, crumb)} className="capitalize">
                    {crumb}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BreadcrumbPage className="capitalize">{crumb}</BreadcrumbPage>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You are here!</p>
                </TooltipContent>
              </Tooltip>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
