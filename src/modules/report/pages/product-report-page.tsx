import { useState } from "react";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";
import { Loader2, FileDown, Search, ArrowUpDown, ArrowUp, ArrowDown, Printer, FileSpreadsheet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PageHeader } from "@/components/ui/page-header";
import { ReportFilter } from "../components/ReportFilter";
import { useProductReport } from "../hooks/use-product-report";
import {
  downloadTextFile,
  formatProductSize,
  formatProductThickness,
  productReportToCSV,
  saveProductReportPDF,
} from "../utils/report-utils";

export function ProductReportPage() {
  const { trigger } = useWebHaptics();
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const {
    products,
    loading,
    search,
    setSearch,
    sortField,
    sortDirection,
    sortedProducts,
    handleSort,
    clearFilters,
  } = useProductReport();

  const handleDownloadCSV = () => {
    trigger("medium");
    downloadTextFile(productReportToCSV(sortedProducts), "product-report.csv");
    toast.success("CSV report downloaded successfully");
  };

  const handleSavePDF = async () => {
    trigger("medium");

    try {
      setPdfGenerating(true);
      toast.loading("Generating PDF report...", { id: "pdf-toast" });
      saveProductReportPDF(products);
      toast.success("PDF report downloaded successfully", { id: "pdf-toast" });
    } catch (error) {
      toast.error("Failed to generate PDF report", { id: "pdf-toast" });
      console.error("Error generating PDF:", error);
    } finally {
      setPdfGenerating(false);
    }
  };

  const onSort = (field: Parameters<typeof handleSort>[0]) => {
    trigger("light");
    handleSort(field);
  };

  const onClearFilters = () => {
    trigger("medium");
    clearFilters();
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="product-report-screen flex flex-col gap-5">
        <PageHeader
          title="Reports"
          subtitle="Manage product reports, download data, and print listings."
        />

        <ReportFilter />

        <div className="bg-panel border border-border/80 shadow-sm overflow-hidden rounded-2xl">
          <div className="p-4 md:p-6 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg text-text">Products Report</h3>
            <span className="text-xs font-semibold text-text-muted">
              Total {sortedProducts.length} Products
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden print-ignore">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search report..."
                className="pl-9 h-9 bg-background border border-border rounded-xl w-full text-xs"
              />
            </div>

            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 font-semibold shrink-0 cursor-pointer h-9 px-2"
              >
                Clear
              </Button>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Download CSV */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCSV}
                disabled={loading || products.length === 0}
                title="Download CSV"
                className="h-9 px-3 border border-border hover:bg-muted font-semibold rounded-xl gap-2 cursor-pointer transition-colors shadow-none text-xs"
              >
                <FileSpreadsheet className="size-4 text-emerald-500" />
                <span>CSV</span>
              </Button>

              {/* Print */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  trigger("light");
                  window.print();
                }}
                disabled={loading || products.length === 0}
                title="Print Report"
                className="h-9 px-3 border border-border hover:bg-muted font-semibold rounded-xl gap-2 cursor-pointer transition-colors shadow-none text-xs"
              >
                <Printer className="size-4 text-blue-500" />
                <span>Print</span>
              </Button>

              {/* Save PDF */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePDF}
                disabled={loading || pdfGenerating || products.length === 0}
                title="Save as PDF"
                className="h-9 px-3 border border-border hover:bg-muted font-semibold rounded-xl gap-2 cursor-pointer transition-colors shadow-none text-xs"
              >
                {pdfGenerating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileDown className="size-4 text-rose-500" />
                )}
                <span>PDF</span>
              </Button>
            </div>
          </div>
        </div>

          <div className="overflow-x-auto relative">
            <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead
                  onClick={() => onSort("product_category")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortField === "product_category" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => onSort("product_sub_category")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Sub Category
                    {sortField === "product_sub_category" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => onSort("products_brand")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Brand
                    {sortField === "products_brand" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => onSort("products_thickness")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Thickness
                    {sortField === "products_thickness" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => onSort("products_size1")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Size
                    {sortField === "products_size1" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => onSort("products_rate")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Rate
                    {sortField === "products_rate" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => onSort("product_status")}
                  className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === "product_status" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3.5 text-muted-foreground/35" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Spinner className="size-5 animate-spin text-primary" />
                      <span className="text-sm font-semibold">Loading product report...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedProducts.length ? (
                sortedProducts.map((p, idx) => {
                  const isActive = p.product_status === "Active";

                  return (
                    <TableRow key={p.id || idx} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                      <TableCell className="px-4 py-3 font-bold text-foreground">
                        {p.product_category || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {p.product_sub_category || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {p.products_brand || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {p.products_thickness || "-"} {p.products_unit || ""}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {p.products_size1 || "-"}x{p.products_size2 || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono font-bold text-foreground">
                        {p.products_rate || "0.00"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.product_status || "Unknown"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground p-6">
                    <p className="text-sm font-semibold">
                      Sorry, there is no matching data to display.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div
        className="product-report-export bg-white text-black"
      >
        <div className="product-report-export-paper">
          <div className="product-report-export-toolbar">
            <h2>Products Report</h2>
          </div>
          <table className="product-report-export-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Brand</th>
                <th>Thickness</th>
                <th>Size</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((product, index) => (
                  <tr key={product.id || index}>
                    <td>{product.product_category || "-"}</td>
                    <td>{product.product_sub_category || "-"}</td>
                    <td>{product.products_brand || "-"}</td>
                    <td>{formatProductThickness(product)}</td>
                    <td>{formatProductSize(product)}</td>
                    <td>{product.products_rate || "0.00"}</td>
                    <td>{product.product_status || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="product-report-empty">
                    Sorry, there is no matching data to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
          .product-report-export {
            display: none;
            color: #000;
            font-family: Roboto, Arial, sans-serif;
          }

          .product-report-export-paper {
            width: 100%;
            background: #fff;
          }

          .product-report-export-toolbar {
            min-height: 64px;
            display: flex;
            align-items: center;
            padding: 0 24px;
            border-bottom: 1px solid rgba(224, 224, 224, 1);
          }

          .product-report-export-toolbar h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 400;
            line-height: 1.6;
            letter-spacing: 0.0075em;
            color: rgba(0, 0, 0, 0.87);
          }

          .product-report-export-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
            background: #fff;
          }

          .product-report-export-table th,
          .product-report-export-table td {
            border-bottom: 1px solid rgba(224, 224, 224, 1);
            color: rgba(0, 0, 0, 0.87);
            font-size: 14px;
            line-height: 1.43;
            padding: 16px;
            text-align: left;
            vertical-align: middle;
          }

          .product-report-export-table th {
            font-weight: 500;
          }

          .product-report-export-table td {
            font-weight: 400;
          }

          .product-report-empty {
            height: 56px;
            text-align: center !important;
          }

          @media print {
            @page {
              size: letter;
              margin: 0;
            }

            html,
            body {
              background: #fff !important;
            }

            body * {
              visibility: hidden !important;
            }

            .product-report-export,
            .product-report-export * {
              visibility: visible !important;
            }

            .product-report-export {
              position: static !important;
              inset: auto !important;
              width: 100% !important;
              display: block !important;
              background: #fff !important;
              color: #000 !important;
            }

            .product-report-screen {
              display: none !important;
            }

            .product-report-export-toolbar {
              min-height: 64px !important;
              padding: 0 24px !important;
            }

            .product-report-export-table th,
            .product-report-export-table td {
              font-size: 14px !important;
              padding: 16px !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .product-report-export-table {
              page-break-inside: auto;
            }

            .product-report-export-table thead {
              display: table-header-group;
            }

            .product-report-export-table tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>
    </div>
  );
}
