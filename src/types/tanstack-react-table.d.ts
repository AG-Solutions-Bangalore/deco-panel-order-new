declare module "@tanstack/react-table" {
  import type * as React from "react";

  export type SortingState = Array<{ id: string; desc: boolean }>;
  export type ColumnFiltersState = Array<{ id: string; value: unknown }>;

  type Updater<T> = T | ((old: T) => T);
  type OnChangeFn<T> = (updater: Updater<T>) => void;

  export interface Column<TData, TValue = unknown> {
    columnDef: ColumnDef<TData, TValue>;
    getIsSorted: () => false | "asc" | "desc";
    setFilterValue: (value: unknown) => void;
    toggleSorting: (desc?: boolean) => void;
  }

  export interface Row<TData> {
    id: string;
    original: TData;
    getValue: <TValue = unknown>(columnId: string) => TValue;
    getVisibleCells: () => Cell<TData, unknown>[];
  }

  export interface Cell<TData, TValue = unknown> {
    id: string;
    column: Column<TData, TValue>;
    getContext: () => unknown;
  }

  export interface Header<TData, TValue = unknown> {
    id: string;
    column: Column<TData, TValue>;
    isPlaceholder: boolean;
    getContext: () => unknown;
  }

  export interface HeaderGroup<TData> {
    id: string;
    headers: Header<TData, unknown>[];
  }

  export interface ColumnDef<TData, TValue = unknown> {
    id?: string;
    accessorKey?: keyof TData | string;
    header?: React.ReactNode | ((props: { column: Column<TData, TValue> }) => React.ReactNode);
    cell?: React.ReactNode | ((props: { row: Row<TData> }) => React.ReactNode);
  }

  export interface Table<TData> {
    getCanNextPage: () => boolean;
    getCanPreviousPage: () => boolean;
    getColumn: (columnId: string) => Column<TData, unknown> | undefined;
    getFilteredRowModel: () => { rows: Row<TData>[] };
    getHeaderGroups: () => HeaderGroup<TData>[];
    getPageCount: () => number;
    getRowModel: () => { rows: Row<TData>[] };
    getState: () => { pagination: { pageIndex: number; pageSize: number } };
    getVisibleFlatColumns: () => Column<TData, unknown>[];
    nextPage: () => void;
    previousPage: () => void;
  }

  export interface TableOptions<TData> {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
    getCoreRowModel: () => unknown;
    getFilteredRowModel?: () => unknown;
    getPaginationRowModel?: () => unknown;
    getSortedRowModel?: () => unknown;
    initialState?: {
      pagination?: {
        pageSize?: number;
      };
    };
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    onGlobalFilterChange?: OnChangeFn<string>;
    onSortingChange?: OnChangeFn<SortingState>;
    state?: {
      columnFilters?: ColumnFiltersState;
      columnVisibility?: Record<string, boolean>;
      globalFilter?: string;
      sorting?: SortingState;
    };
  }

  export function flexRender<TProps>(component: unknown, props: TProps): React.ReactNode;
  export function getCoreRowModel(): () => unknown;
  export function getFilteredRowModel(): () => unknown;
  export function getPaginationRowModel(): () => unknown;
  export function getSortedRowModel(): () => unknown;
  export function useReactTable<TData>(options: TableOptions<TData>): Table<TData>;
}
