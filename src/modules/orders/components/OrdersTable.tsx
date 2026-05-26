import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  Header,
  HeaderGroup,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePlus,
  Pencil
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWebHaptics } from "web-haptics/react";
import { PendingOrder } from "../types";
import { formatOrderDate } from "../utils/date";

interface OrdersTableProps {
  orders: PendingOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const { trigger } = useWebHaptics();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [userTypeId, setUserTypeId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserTypeId(localStorage.getItem("user_type_id"));
    }
  }, []);

  // Filter unique statuses from incoming orders for dynamic filter tabs/pills
  const availableStatuses = ["ALL", ...Array.from(new Set(orders.map((o) => o.orders_status.toUpperCase())))];

  // Define Columns
  const columns: ColumnDef<PendingOrder>[] = [
    {
      accessorKey: "orders_no",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              trigger("light");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
          >
            Order
            <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-bold text-text text-sm">
            #{row.getValue("orders_no")}
          </span>
          <span className="text-text-muted text-xs font-semibold">
            {formatOrderDate(row.original.orders_date)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              trigger("light");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
            className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
          >
            Customer
            <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = (row.original.orders_status as string) || "Pending";

        let badgeClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
        if (status.toLowerCase().includes("complete") || status.toLowerCase().includes("deliver")) {
          badgeClasses = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
        } else if (status.toLowerCase().includes("cancel")) {
          badgeClasses = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
        } else if (status.toLowerCase().includes("progress") || status.toLowerCase().includes("process")) {
          badgeClasses = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
        }

        return (
          <div className="flex flex-col gap-1.5 py-1">
            <span className="font-semibold text-text text-sm leading-tight">
              {row.getValue("full_name")}
            </span>
            <div className="flex items-center">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses}`}>
                {status}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "orders_date",
    },
    {
      accessorKey: "orders_status",
    },
    {
      id: "actions",
      header: () => (
        <span className="font-bold text-xs uppercase tracking-wider text-text-muted text-right block pr-4">
          Actions
        </span>
      ),
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5 pr-2" onClick={(e) => e.stopPropagation()}>
            {userTypeId !== "1" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-all cursor-pointer"
                      asChild
                    >
                      <Link to={`/orders/edit/${order.id}`} onClick={() => trigger("light")}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-foreground text-background font-semibold text-xs px-2.5 py-1 rounded-lg">
                    Edit Order
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 text-text-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 rounded-xl transition-all cursor-pointer"
                      asChild
                    >
                      <Link to={`/quotes/create/${order.id}`} onClick={() => trigger("light")}>
                        <FilePlus className="size-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-foreground text-background font-semibold text-xs px-2.5 py-1 rounded-lg">
                    Generate Quotation
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 text-text-muted hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 rounded-xl transition-all cursor-pointer"
                  asChild
                >
                  <Link to={`/orders/${order.id}`} onClick={() => trigger("light")}>
                    <Eye className="size-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-foreground text-background font-semibold text-xs px-2.5 py-1 rounded-lg">
                View Order
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Initialize React Table
  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility: {
        orders_date: false,
        orders_status: false,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Filter handler for status pills
  const handleStatusFilter = (status: string) => {
    trigger("light");
    setSelectedStatus(status);
    if (status === "ALL") {
      table.getColumn("orders_status")?.setFilterValue(undefined);
    } else {
      table.getColumn("orders_status")?.setFilterValue(status);
    }
  };

  const hasActiveFilters = globalFilter || selectedStatus !== "ALL";

  const clearAllFilters = () => {
    trigger("medium");
    setGlobalFilter("");
    setSelectedStatus("ALL");
    table.getColumn("orders_status")?.setFilterValue(undefined);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* <div className="flex flex-col gap-4 bg-panel border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by Order # or Customer name..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full bg-background border border-border hover:border-border-hover focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium outline-none transition-all placeholder:text-text-muted"
            />
            {globalFilter && (
              <button
                onClick={() => {
                  trigger("light");
                  setGlobalFilter("");
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text rounded-full p-0.5 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>


          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 font-semibold self-end md:self-auto cursor-pointer"
            >
              Clear Filters
              <X className="ml-1 size-3" />
            </Button>
          )}
        </div>


        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider">
            <SlidersHorizontal className="size-3.5 text-primary" />
            <span>Filter Status</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {availableStatuses.map((status) => {
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-xs scale-102"
                      : "bg-background border-border text-text-muted hover:text-text hover:border-border-hover"
                    }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>
      </div> */}

        {/* Main Table Card */}
        <Card className="bg-panel py-0 border border-border/80 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto relative scrollbar-thin">
              <Table>
                <TableHeader className="bg-muted/40 border-b border-border/60">
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<PendingOrder>) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header: Header<PendingOrder, unknown>) => (
                        <TableHead
                          key={header.id}
                          className="py-3.5 px-4 font-bold align-middle"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => {
                          trigger("light");
                          if (typeof window !== "undefined") {
                            window.location.href = `/orders/${row.original.id}`;
                          }
                        }}
                        className="border-b border-border/40 hover:bg-primary/[0.03] dark:hover:bg-primary/[0.08] transition-all duration-300 ease-in-out cursor-pointer group"
                      >
                      {row.getVisibleCells().map((cell: Cell<PendingOrder, unknown>) => (
                          <TableCell key={cell.id} className="py-3 px-4 align-middle">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={table.getVisibleFlatColumns().length}
                        className="h-48 text-center text-text-muted p-6"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl">📦</span>
                          <p className="font-semibold text-text/80">No orders found.</p>
                          <p className="text-xs text-text-muted max-w-xs">
                            Try adjusting your search query or status filter to see other orders.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {table.getPageCount() > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t border-border/60 bg-muted/20">
                <div className="text-xs font-semibold text-text-muted">
                  Showing{" "}
                  <span className="font-bold text-text">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-text">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-text">
                    {table.getFilteredRowModel().rows.length}
                  </span>{" "}
                  orders
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      trigger("light");
                      table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8.5 rounded-lg border-border hover:bg-background cursor-pointer gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      trigger("light");
                      table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                    className="h-8.5 rounded-lg border-border hover:bg-background cursor-pointer gap-1"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
