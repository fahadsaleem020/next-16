"use client";

import { type CellContext, flexRender, type Header, type HeaderContext } from "@tanstack/react-table";
import { AlertCircleIcon, ArrowDownNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { type FC, forwardRef, memo, useEffect, useState } from "react";
import { PiCaretUpDownFill } from "react-icons/pi";
import { useDebounceCallback, useIntersectionObserver } from "usehooks-ts";
import { useGlobalTable } from "@/providers/table.provider";
import { Flex } from "@/ui/flex";
import { Input, type InputProps } from "@/ui/input";
import { Skeleton } from "@/ui/skeleton";
import { Stack } from "@/ui/stack";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "@/utils/cn";

interface WithVirtualScroll {
  hasNextPage: boolean;
  fetchNextPage: any;
  isVirtual?: true;
}

interface WithOutVirtualScroll {
  fetchNextPage?: never;
  hasNextPage?: never;
  isVirtual?: false;
}

const TableComponent: FC<
  {
    withToolTip?: { enabled: boolean; content: string };
    loadingRowId?: string;
    isLoading?: boolean;
  } & (WithVirtualScroll | WithOutVirtualScroll)
> = memo(({ withToolTip = { enabled: false, content: "" }, fetchNextPage, loadingRowId, hasNextPage, isLoading, isVirtual }) => {
  const { table, onDoubleClickHandler, onSingleClickHandler } = useGlobalTable();

  const { isIntersecting, ref } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage]);

  return (
    <Table className={cn(isLoading && "min-h-[50vh]")}>
      <TableHeader className="sticky top-0 bg-background">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="capitalize text-center">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody className="overflow-visible">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, key) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("tooltip-indicator", withToolTip.enabled && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={i}
                      onClick={() => {
                        if (cell.column.id !== "action") {
                          onSingleClickHandler?.(row);
                        }
                      }}
                      onDoubleClick={() => {
                        if (cell.column.id !== "action") {
                          onDoubleClickHandler?.(row);
                        }
                      }}
                    >
                      {row.id === loadingRowId ? (
                        <Skeleton className="size-full h-10" />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TooltipTrigger>
              <TooltipContent hidden={!withToolTip.enabled}>
                <p>{withToolTip.content}</p>
              </TooltipContent>
            </Tooltip>
          ))
        ) : !isLoading ? (
          <TableRow>
            <TableCell colSpan={8} className="h-24">
              <Flex className="bg-yellow-50 rounded-lg size-full p-5 justify-center text-yellow-700">
                <AlertCircleIcon />
                <p>Nothing to show</p>
              </Flex>
            </TableCell>
          </TableRow>
        ) : (
          Array.from({ length: table?._getColumnDefs().length ?? 0 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j} className="h-5">
                  <Skeleton className="size-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}

        {isVirtual && (
          <TableRow ref={ref} hidden={!hasNextPage} className="[&_td:first-child]:rounded-s-xl [&_td:last-child]:rounded-e-xl">
            <TableCell colSpan={99} className="bg-slate-50">
              <Flex className="items-end justify-between">
                <Flex>
                  <Skeleton className="size-16 rounded-md bg-slate-200" />
                  <Stack className="justify-end">
                    <Skeleton className="flex-1 max-h-5 w-20 rounded-[7px] bg-slate-200" />
                    <Skeleton className="flex-1 max-h-5 w-24 rounded-[7px] bg-slate-200" />
                  </Stack>
                </Flex>
                {Array(2)
                  .fill(null)
                  .map((_, key) => (
                    <Stack className="justify-end" key={key}>
                      <Skeleton className="h-16 max-h-5 w-20 rounded-[7px] bg-slate-200" />
                      <Skeleton className="h-16 max-h-5 w-24 rounded-[7px] bg-slate-200" />
                    </Stack>
                  ))}
              </Flex>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

export const SortedHeader: FC<{ header: Header<any, any>; label: string }> = ({ header, label }) => {
  return (
    <Flex
      className="cursor-pointer items-center text-muted-foreground font-semibold capitalize w-fit"
      onClick={() => header.column.toggleSorting()}
    >
      {label}

      {{
        asc: <ArrowDownNarrowWide size={20} />,
        desc: <ArrowDownWideNarrow size={20} />,
      }[header.column.getIsSorted() as string] ?? <PiCaretUpDownFill className="opacity-45" />}
    </Flex>
  );
};

export const checkBoxProps = (params: HeaderContext<any, any> | CellContext<any, any>) => {
  interface returnType {
    id: string;
    className: string;
    onCheckedChange: () => void;
    checked: "indeterminate" | boolean;
  }

  return {
    checked:
      "row" in params
        ? params.row.getIsSelected()
        : params.table.getIsAllPageRowsSelected()
          ? true
          : params.table.getIsSomeRowsSelected()
            ? "indeterminate"
            : false,
    onCheckedChange: () => ("row" in params ? params.row.toggleSelected() : params.table.toggleAllPageRowsSelected()),
    className: "data-[state=checked]:bg-hollywood-500 data-[state=checked]:text-white data-[state=checked]:border-none",
  } as returnType;
};

export interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  onChange: (value: string) => void;
  delay?: number;
  value: string;
}

export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, delay = 500, onChange, ...props }, ref) => {
    const [value, setValue] = useState(initialValue);
    const narrow = useDebounceCallback(() => onChange(value), delay);

    useEffect(() => {
      const isEmpty = !value.trim().length;
      if (isEmpty) {
        setValue(value);
        onChange(value);
      } else {
        setValue(value);
        narrow();
      }
    }, [value, onChange, narrow]);

    return (
      <Input
        className={cn("bg-white", props.className)}
        // leftIcon={<Search className="text-gray-400 mx-2 size-5 " />}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        value={value}
        type="text"
        ref={ref}
        {...props}
      />
    );
  },
);

export { TableComponent };
