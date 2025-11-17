"use client";

import { faker } from "@faker-js/faker";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import { TableProvider } from "@/providers/table.provider";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Flex } from "@/ui/flex";
import { Stack } from "@/ui/stack";
import { SortedHeader, TableComponent } from "./tablecomponent";

interface Blog {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  bookmarks: number;
  comments: number;
  slug: string;
}

export default function BlogsTable() {
  const data = Array.from(
    { length: 15 },
    () =>
      ({
        id: faker.string.nanoid(4),
        title: faker.lorem.words({ min: 3, max: 8 }),
        status: faker.helpers.arrayElement(["DRAFT", "PUBLISHED", "ARCHIVED"]),
        author: faker.person.fullName(),
        tags: faker.helpers.arrayElements(["React", "Next.js", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js"], { min: 1, max: 3 }),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        publishedAt: faker.date.recent().toISOString(),
        views: faker.number.int({ min: 0, max: 1000 }),
        bookmarks: faker.number.int({ min: 0, max: 100 }),
        comments: faker.number.int({ min: 0, max: 50 }),
        slug: faker.word
          .words({ count: { min: 2, max: 4 } })
          .split(" ")
          .join("-")
          .toLowerCase(),
      }) satisfies Blog,
  );

  const columns = useMemo<ColumnDef<Blog>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ header }) => <SortedHeader header={header} label="Title" />,
        cell: ({ row }) => (
          <Stack className="max-w-[300px]">
            <p className="font-medium text-primary truncate">{row.getValue("title")}</p>
            <p className="text-sm text-muted-foreground">/{row.original.slug}</p>
          </Stack>
        ),
      },
      {
        accessorKey: "status",
        header: ({ header }) => <SortedHeader header={header} label="Status" />,
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusColors = {
            DRAFT: "bg-yellow-100 text-yellow-800",
            PUBLISHED: "bg-green-100 text-green-800",
            ARCHIVED: "bg-gray-100 text-gray-800",
          };
          return <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>;
        },
      },
      {
        accessorKey: "author",
        header: ({ header }) => <SortedHeader header={header} label="Author" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("author")}</span>,
      },
      {
        accessorKey: "tags",
        header: () => <p className="text-muted-foreground font-semibold">Tags</p>,
        cell: ({ row }) => (
          <Flex className="flex-wrap gap-1 max-w-[200px]">
            {row.original.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </Flex>
        ),
      },
      {
        accessorKey: "views",
        header: ({ header }) => <SortedHeader header={header} label="Views" />,
        cell: ({ row }) => <span className="text-muted-foreground font-medium">{row.getValue("views")}</span>,
      },
      {
        accessorKey: "bookmarks",
        header: ({ header }) => <SortedHeader header={header} label="Bookmarks" />,
        cell: ({ row }) => <span className="text-muted-foreground font-medium">{row.getValue("bookmarks")}</span>,
      },
      {
        accessorKey: "comments",
        header: ({ header }) => <SortedHeader header={header} label="Comments" />,
        cell: ({ row }) => <span className="text-muted-foreground font-medium">{row.getValue("comments")}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ header }) => <SortedHeader header={header} label="Created" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">{format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}</span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: ({ header }) => <SortedHeader header={header} label="Updated" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">{format(new Date(row.getValue("updatedAt")), "MMM dd, yyyy")}</span>
        ),
      },
      {
        accessorKey: "publishedAt",
        header: ({ header }) => <SortedHeader header={header} label="Published" />,
        cell: ({ row }) => {
          const publishedAt = row.getValue("publishedAt") as string | undefined;
          return <span className="text-muted-foreground text-sm">{publishedAt ? format(new Date(publishedAt), "MMM dd, yyyy") : "-"}</span>;
        },
      },
      {
        id: "actions",
        header: () => <p className="text-muted-foreground font-semibold">Actions</p>,
        cell: () => (
          <Flex className="gap-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    [],
  );

  return (
    <TableProvider data={data} columns={columns}>
      <TableComponent />
    </TableProvider>
  );
}
