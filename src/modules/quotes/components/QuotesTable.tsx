import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import type {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowRight,
  ArrowUpDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";
import {
  useCompleteQuotationMutation,
  useProceedQuotationMutation,
} from "../hooks/use-quotes";
import { Quotation } from "../types";
import { formatQuotationDate } from "../utils/date";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

interface QuotesTableProps {
  quotes: Quotation[];
  type: "open" | "processing" | "completed";
}

export default function QuotesTable({ quotes, type }: QuotesTableProps) {
  const { trigger } = useWebHaptics();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // State for confirm dialogs
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"Completed" | "Cancel" | "">("");

  // Mutations
  const proceedMutation = useProceedQuotationMutation();
  const completeMutation = useCompleteQuotationMutation();

  const handleOpenProceed = (id: number) => {
    trigger("light");
    setSelectedQuoteId(id);
    setConfirmOpen(true);
  };

  const handleCloseProceed = () => {
    setConfirmOpen(false);
    setSelectedQuoteId(null);
  };

  const handleProceedConfirm = () => {
    if (!selectedQuoteId) return;
    trigger("medium");
    proceedMutation.mutate(selectedQuoteId, {
      onSuccess: (res) => {
        if (res.code === 200) {
          toast.success("Quotation moved to processing list successfully");
        } else {
          toast.error(res.msg || "Failed to proceed quotation");
        }
        handleCloseProceed();
      },
      onError: (err: unknown) => {
        toast.error(getErrorMessage(err, "Error processing quotation"));
        handleCloseProceed();
      },
    });
  };

  const handleOpenStatusUpdate = (id: number) => {
    trigger("light");
    setSelectedQuoteId(id);
    setNewStatus("");
    setStatusUpdateOpen(true);
  };

  const handleCloseStatusUpdate = () => {
    setStatusUpdateOpen(false);
    setSelectedQuoteId(null);
    setNewStatus("");
  };

  const handleStatusUpdateConfirm = () => {
    if (!selectedQuoteId || !newStatus) return;
    trigger("medium");
    completeMutation.mutate(
      { id: selectedQuoteId, status: newStatus as "Completed" | "Cancel" },
      {
        onSuccess: (res) => {
          if (res.code === 200) {
            toast.success(`Quotation updated to ${newStatus} successfully`);
          } else {
            toast.error(res.msg || "Failed to update quotation");
          }
          handleCloseStatusUpdate();
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err, "Error updating quotation"));
          handleCloseStatusUpdate();
        },
      }
    );
  };

  // Filter unique statuses from incoming quotes for dynamic filter pills
  const availableStatuses = ["ALL", ...Array.from(new Set(quotes.map((q) => q.quotation_status.toUpperCase())))];

  // Define Columns
  const columns: ColumnDef<Quotation>[] = [
    {
      accessorKey: "quotation_no",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            trigger("light");
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
        >
          Quote No
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-bold text-text text-sm">
            #{row.getValue("quotation_no")}
          </span>
          <span className="text-text-muted text-xs font-semibold md:hidden">
            {formatQuotationDate(row.original.quotation_date)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "quotation_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            trigger("light");
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
        >
          Date
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-text text-sm font-medium">
          {formatQuotationDate(row.getValue("quotation_date"))}
        </span>
      ),
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            trigger("light");
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
        >
          Customer
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = (row.original.quotation_status as string) || "Quotation";
        
        let badgeClasses = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
        if (status.toLowerCase().includes("complete")) {
          badgeClasses = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
        } else if (status.toLowerCase().includes("cancel")) {
          badgeClasses = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
        } else if (status.toLowerCase().includes("process")) {
          badgeClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
        }

        return (
          <div className="flex flex-col gap-1.5 py-1">
            <span className="font-semibold text-text text-sm leading-tight">
              {row.getValue("full_name")}
            </span>
            <div className="flex items-center md:hidden">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses}`}>
                {status}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "quotation_status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            trigger("light");
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
        >
          Status
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = (row.getValue("quotation_status") as string) || "Quotation";
        
        let badgeClasses = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
        if (status.toLowerCase().includes("complete")) {
          badgeClasses = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
        } else if (status.toLowerCase().includes("cancel")) {
          badgeClasses = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
        } else if (status.toLowerCase().includes("process")) {
          badgeClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
        }

        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClasses}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="font-bold text-xs uppercase tracking-wider text-text-muted block text-right pr-4">
          Actions
        </span>
      ),
      cell: ({ row }) => {
        const quote = row.original;
        
        return (
          <div className="flex items-center justify-end gap-1.5">
            {/* Proceed to processing (only for Open quotations list) */}
            {type === "open" && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Proceed to Processing"
                  className="h-8 w-8 text-text-muted hover:text-amber-500 hover:bg-amber-500/5 rounded-full transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProceed(quote.id);
                  }}
                >
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="icon-sm"
                  title="Edit Quotation"
                  className="h-8 w-8 text-text-muted hover:text-primary hover:bg-primary/5 rounded-full transition-colors cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to={`/quotes/edit/${quote.id}`}>
                    <Edit className="size-4" />
                  </Link>
                </Button>
              </>
            )}

            {/* Complete/Cancel (only for Processing quotations list) */}
            {type === "processing" && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Update Completion Status"
                className="h-8 w-8 text-text-muted hover:text-emerald-500 hover:bg-emerald-500/5 rounded-full transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenStatusUpdate(quote.id);
                }}
              >
                <CheckCircle className="size-4" />
              </Button>
            )}

            {/* Always available view quote details */}
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              title="View Quote Details"
              className="h-8 w-8 text-text-muted hover:text-primary hover:bg-primary/5 rounded-full transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/quotes/${quote.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  // Initialize React Table
  const table = useReactTable({
    data: quotes,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
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

  const handleStatusFilter = (status: string) => {
    trigger("light");
    setSelectedStatus(status);
    if (status === "ALL") {
      table.getColumn("quotation_status")?.setFilterValue(undefined);
    } else {
      table.getColumn("quotation_status")?.setFilterValue(status);
    }
  };

  const hasActiveFilters = globalFilter || selectedStatus !== "ALL";

  const clearAllFilters = () => {
    trigger("medium");
    setGlobalFilter("");
    setSelectedStatus("ALL");
    table.getColumn("quotation_status")?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Table Card */}
      <Card className="bg-panel py-0 border border-border/80 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto relative scrollbar-thin">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/60">
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<Quotation>) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header: Header<Quotation, unknown>) => {
                      const columnId = header.column.id;
                      const isResponsive = columnId === "quotation_date" || columnId === "quotation_status";
                      return (
                        <TableHead
                          key={header.id}
                          className={`py-3.5 px-4 font-bold align-middle ${isResponsive ? "hidden md:table-cell" : ""}`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
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
                          window.location.href = `/quotes/${row.original.id}`;
                        }
                      }}
                      className="border-b border-border/40 hover:bg-primary/[0.03] dark:hover:bg-primary/[0.08] transition-all duration-300 ease-in-out cursor-pointer group"
                    >
                      {row.getVisibleCells().map((cell: Cell<Quotation, unknown>) => {
                        const columnId = cell.column.id;
                        const isResponsive = columnId === "quotation_date" || columnId === "quotation_status";
                        return (
                          <TableCell 
                            key={cell.id} 
                            className={`py-3 px-4 align-middle ${isResponsive ? "hidden md:table-cell" : ""}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
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
                        <p className="font-semibold text-text/80">No quotations found.</p>
                        <p className="text-xs text-text-muted max-w-xs">
                          Try adjusting your search query or status filter to see other quotations.
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
                quotations
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

      {/* Confirmation modal: Proceed to Processing */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md bg-popover border border-border rounded-2xl shadow-xl animate-in duration-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text flex items-center gap-2">
              ⚠️ Confirm Processing
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted mt-1 leading-relaxed">
              Do you want to change the quotation to process?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCloseProceed}
              className="cursor-pointer"
            >
              No
            </Button>
            <Button
              onClick={handleProceedConfirm}
              className="cursor-pointer"
              disabled={proceedMutation.isPending}
            >
              {proceedMutation.isPending ? "Updating..." : "Yes, Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation modal: Complete / Cancel Update Status */}
      <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
        <DialogContent className="max-w-md bg-popover border border-border rounded-2xl shadow-xl animate-in duration-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text flex items-center gap-2">
              ✏️ Update Status
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted mt-1 leading-relaxed">
              Please select the final completed or cancel status for this quotation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select
              value={newStatus}
              onValueChange={(val) => setNewStatus(val as "Completed" | "Cancel")}
            >
              <SelectTrigger className="w-full bg-background border border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text">
                <SelectValue placeholder="Choose new status..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border rounded-xl shadow-md z-[60]">
                <SelectItem value="Completed" className="cursor-pointer font-semibold hover:bg-primary/5">Completed</SelectItem>
                <SelectItem value="Cancel" className="cursor-pointer font-semibold hover:bg-primary/5 text-rose-500">Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCloseStatusUpdate}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdateConfirm}
              className="cursor-pointer"
              disabled={!newStatus || completeMutation.isPending}
            >
              {completeMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
