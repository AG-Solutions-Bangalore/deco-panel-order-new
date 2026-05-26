import { FormEvent } from "react";
import { useWebHaptics } from "web-haptics/react";
import { FileDown, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ReportFilter } from "../components/ReportFilter";
import { DatePicker } from "../components/DatePicker";
import { useReportForm } from "../hooks/use-report-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { value: "Order", label: "Order" },
  { value: "Quotation", label: "Quotation" },
  { value: "Cancel", label: "Cancel" },
];

export function OrderReportPage() {
  const { trigger } = useWebHaptics();
  const {
    userId: orderUserId,
    setUserId: setOrderUserId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status: orderStatus,
    setStatus: setOrderStatus,
    clients,
    loadingClients,
    downloading,
    downloadReport,
    viewReport,
  } = useReportForm("order");

  const handleDownload = async (e: FormEvent) => {
    trigger("medium");
    await downloadReport(e);
  };

  const handleView = (e: FormEvent) => {
    trigger("light");
    viewReport(e);
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <PageHeader
        title="Reports"
        subtitle="Manage order reports, export CSV data, or inspect detailed summaries."
      />

      <ReportFilter />

      <Card className="bg-panel border border-border/80 shadow-sm overflow-hidden rounded-2xl">
        <div className="p-4 md:p-6 border-b border-border/60">
          <h3 className="font-bold text-lg text-text">Orders Detailed Report</h3>
        </div>

        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleDownload}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Client Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Client <span className="text-destructive">*</span>
                </label>
                <Select
                  value={orderUserId}
                  onValueChange={setOrderUserId}
                >
                  <SelectTrigger className="!w-full !h-11 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-h-60 overflow-y-auto z-50">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingClients && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Loader2 className="size-3 animate-spin" /> Loading clients...
                  </span>
                )}
              </div>

              {/* From Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  From Date
                </label>
                <DatePicker
                  date={fromDate}
                  setDate={setFromDate}
                  placeholder="Select From Date"
                />
              </div>

              {/* To Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  To Date
                </label>
                <DatePicker
                  date={toDate}
                  setDate={setToDate}
                  placeholder="Select To Date"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Status
                </label>
                <Select
                  value={orderStatus || "ALL_STATUS"}
                  onValueChange={(val) => setOrderStatus(val === "ALL_STATUS" ? "" : val)}
                >
                  <SelectTrigger className="!w-full !h-11 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="w-[--radix-select-trigger-width] z-50">
                    <SelectItem value="ALL_STATUS">All Statuses</SelectItem>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={downloading || !orderUserId}
                className="h-11 bg-primary text-primary-foreground font-semibold px-5 rounded-xl gap-2 cursor-pointer shadow-xs"
              >
                {downloading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileDown className="size-4" />
                )}
                {downloading ? "Downloading..." : "Download CSV"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleView}
                disabled={downloading || !orderUserId}
                className="h-11 border border-border hover:bg-muted font-semibold px-5 rounded-xl gap-2 cursor-pointer transition-colors"
              >
                <Eye className="size-4 text-muted-foreground" />
                View Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
