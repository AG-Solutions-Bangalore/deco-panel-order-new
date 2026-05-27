import { Link } from "react-router-dom";
import { Search, Minus, RefreshCw, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { formatOrderDate } from "@/modules/orders/utils/date";
import { PendingOrder } from "../types";

interface RecentOrdersCardProps {
  orders: PendingOrder[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  showTable: boolean;
  setShowTable: (show: boolean) => void;
  setFullClose: (close: boolean) => void;
  onReload: () => void;
  onActionClick: () => void;
}

export function RecentOrdersCard({
  orders,
  searchQuery,
  setSearchQuery,
  isLoading,
  isFetching,
  error,
  showTable,
  setShowTable,
  setFullClose,
  onReload,
  onActionClick,
}: RecentOrdersCardProps) {
  return (
    <Card className="lg:col-span-2 bg-panel border border-border shadow-sm rounded-2xl overflow-hidden flex flex-col transition-all duration-300">
      <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-0 gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-extrabold text-text">
            Recent Pending Orders
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-text-muted">
            Latest active customer orders awaiting processing.
          </CardDescription>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 text-text-muted self-end sm:self-auto">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onActionClick();
              setShowTable(!showTable);
            }}
            className="size-8 rounded-lg hover:bg-muted cursor-pointer"
            title={showTable ? "Collapse panel" : "Expand panel"}
          >
            <Minus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onReload}
            className="size-8 rounded-lg hover:bg-muted cursor-pointer"
            disabled={isLoading || isFetching}
            title="Reload"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onActionClick();
              setFullClose(false);
            }}
            className="size-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Dismiss card"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      
      {showTable && (
        <>
          {/* Search Bar */}
          <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between gap-3">
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search recent orders by number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-panel border border-border hover:border-border-strong focus:border-primary/80 focus:ring-1 focus:ring-primary/20 rounded-xl pl-9.5 pr-8 py-2 text-xs font-semibold outline-none transition-all placeholder:text-text-soft"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    onActionClick();
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text rounded-full p-0.5 hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
            
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider hidden sm:block">
              Filtered: <span className="font-mono text-text">{orders.length}</span> orders
            </div>
          </div>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-2">
                <Spinner className="size-6 text-primary" />
                <span className="text-xs text-text-muted font-bold animate-pulse">Loading orders...</span>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-xs font-bold text-destructive">
                Error retrieving pending orders. Please refresh.
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto relative">
                <Table>
                  <TableHeader className="bg-muted/40 border-b border-border/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">Order No</TableHead>
                      <TableHead className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">Date</TableHead>
                      <TableHead className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">Client Name</TableHead>
                      <TableHead className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">Status</TableHead>
                      <TableHead className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-text-muted text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="border-b border-border/40 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.06] transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm font-bold text-text">
                          #{order.orders_no}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-text-muted">
                          {formatOrderDate(order.orders_date)}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-text">
                          {order.full_name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {order.orders_status || "Order"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right pr-6">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                            asChild
                          >
                            <Link to={`/orders/${order.id}`} onClick={onActionClick}>
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                        </td>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center text-text-muted flex flex-col gap-2 items-center">
                <span className="text-2xl">📦</span>
                <p className="font-semibold text-sm">No orders match your filter criteria.</p>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
export default RecentOrdersCard;
