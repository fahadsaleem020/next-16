"use client";

import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type FilterFn,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type Row,
  type SortingState,
  type Table,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const TableContext = createContext<TableContextType<any>>({} as any);
const useGlobalTable = <T,>() => useContext(TableContext) as TableContextType<T>;

interface BaseProps<T> {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  onDoubleClickHandler?: (row: Row<T>) => void;
  onSingleClickHandler?: (row: Row<T>) => void;
  expanded?: ExpandedState;
  globalFilter: string;
}

export interface TableContextType<T> extends BaseProps<T> {
  table: Table<any>;
}

type ChildrenProps<T> = {
  table: Table<T>;
  selectedRows: T[] | undefined;
};

interface TableProviderProps<T> extends Pick<BaseProps<T>, "onDoubleClickHandler" | "onSingleClickHandler"> {
  data: T[];
  expanded?: ExpandedState;
  columns: ColumnDef<T, any>[];
  getSubRows?: (row: T) => T[] | undefined;
  onExpandedChange?: OnChangeFn<ExpandedState> | undefined;
  children: React.ReactNode | ((props: ChildrenProps<T>) => React.ReactNode);
}

const TableProvider: <T>(props: TableProviderProps<T>) => ReactNode = ({
  data,
  columns,
  children,
  expanded,
  getSubRows,
  onExpandedChange,
  onDoubleClickHandler,
  onSingleClickHandler,
}) => {
  const flatData = useMemo(() => data ?? [], [data]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    defaultColumn: {
      minSize: 60,
      maxSize: 1200,
    },
    data: flatData,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      ...(expanded !== undefined && { expanded }),
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onGlobalFilterChange: (value) => setGlobalFilter(value),
    ...(getSubRows && { getSubRows }),
    ...(expanded !== undefined && {
      onExpandedChange,
      getExpandedRowModel: getExpandedRowModel(),
    }),
  });

  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length) setSelectedRows(selectedRows.map((val) => val.original));
  }, [table.getFilteredSelectedRowModel()]);

  useEffect(() => {
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        table.resetRowSelection();
      }
    };
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  return (
    <TableContext.Provider
      value={{
        onDoubleClickHandler,
        onSingleClickHandler,
        setGlobalFilter,
        globalFilter,
        expanded,
        table,
      }}
    >
      {typeof children === "function" ? children({ table, selectedRows }) : children}
    </TableContext.Provider>
  );
};

export { TableProvider, useGlobalTable };
