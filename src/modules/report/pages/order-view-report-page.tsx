import { useState, useRef } from "react";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";
import { Loader2, ArrowLeft, FileDown, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PageHeader } from "@/components/ui/page-header";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useViewReport } from "../hooks/use-view-report";
import { formatReportCell } from "../utils/report-utils";

export function OrderViewReportPage() {
  const { trigger } = useWebHaptics();
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const itemsPerPage = 15;
  const tableRef = useRef<HTMLDivElement>(null);
  const {
    loading,
    headers,
    rows,
    search,
    setSearch,
    sortColIndex,
    sortDirection,
    sortedRows,
    currentPage,
    setCurrentPage,
    handleSort,
    goBack,
  } = useViewReport("order");

  const handleSavePDF = async () => {
    trigger("medium");
    const element = tableRef.current;
    if (!element) return;

    try {
      setPdfGenerating(true);
      toast.loading("Generating PDF report...", { id: "pdf-toast" });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaled height of the entire canvas when fit to pdfWidth
      const imgHeightInPdfUnits = (imgHeight * pdfWidth) / imgWidth;
      
      let heightLeft = imgHeightInPdfUnits;
      let position = 0; // Top position of the image on the current page

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdfUnits);
      heightLeft -= pdfHeight;

      // While there is more content to draw, add new pages
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeightInPdfUnits; // This moves the image up to render the next chunk
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdfUnits);
        heightLeft -= pdfHeight;
      }
      
      pdf.save("order-report.pdf");
      toast.success("PDF report downloaded successfully", { id: "pdf-toast" });
    } catch (error) {
      toast.error("Failed to generate PDF report", { id: "pdf-toast" });
      console.error("Error generating PDF:", error);
    } finally {
      setPdfGenerating(false);
    }
  };

  const onSort = (index: number) => {
    trigger("light");
    handleSort(index);
  };

  // Paginate rows
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + itemsPerPage);

  const onGoBack = () => {
    trigger("light");
    goBack();
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4 mb-2">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onGoBack}
            className="rounded-xl border border-border h-10 w-10 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="size-4 text-text" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text">
              View Order Report
            </h1>
            <p className="text-xs md:text-sm font-medium text-text-muted">
              Inspect order detailed statistics and records.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-panel border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-text-muted group-focus-within:text-primary transition-colors" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search matching report fields..."
            className="pl-10 h-11 bg-background border border-border rounded-xl w-full"
          />
        </div>

        <Button
          onClick={handleSavePDF}
          disabled={loading || pdfGenerating || rows.length === 0}
          className="w-full md:w-auto h-11 bg-primary text-primary-foreground font-semibold px-4 rounded-xl gap-2 cursor-pointer shadow-xs"
        >
          {pdfGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileDown className="size-4" />
          )}
          {pdfGenerating ? "Generating..." : "Save PDF"}
        </Button>
      </div>

      <div ref={tableRef} className="bg-panel border border-border/80 shadow-sm overflow-hidden rounded-2xl">
        <div className="p-4 md:p-6 border-b border-border/60 flex justify-between items-center">
          <h3 className="font-bold text-lg text-text">Detailed Orders</h3>
          <span className="text-xs font-semibold text-text-muted">
            Total {sortedRows.length} Rows
          </span>
        </div>

        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                {headers.map((header, idx) => (
                  <TableHead
                    key={idx}
                    onClick={() => onSort(idx)}
                    className="px-4 py-3.5 font-bold text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      {header}
                      {sortColIndex === idx ? (
                        sortDirection === "asc" ? <ArrowUp className="size-3 text-primary" /> : <ArrowDown className="size-3 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3 text-muted-foreground/35" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headers.length || 6} className="h-48 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Spinner className="size-5 animate-spin text-primary" />
                      <span className="text-sm font-semibold">Loading report data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedRows.length ? (
                paginatedRows.map((row, rowIdx) => (
                  <TableRow key={rowIdx} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                    {row.map((cell, cellIdx) => {
                      const isAmount = cell.includes("₹") || /^\d+\.\d{2}$/.test(cell);
                      const displayCell = formatReportCell(headers[cellIdx] || "", cell);
                      return (
                        <TableCell
                          key={cellIdx}
                          className={`px-4 py-3 text-sm text-foreground whitespace-nowrap ${
                            isAmount ? "font-mono font-bold text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {displayCell}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length || 6} className="h-48 text-center text-muted-foreground p-6">
                    <p className="text-sm font-semibold">
                      Sorry, there is no matching data to display.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/60 bg-muted/20">
            <div className="text-xs font-semibold text-text-muted">
              Showing <span className="font-bold text-text">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-text">
                {Math.min(startIndex + itemsPerPage, sortedRows.length)}
              </span>{" "}
              of <span className="font-bold text-text">{sortedRows.length}</span> records
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  trigger("light");
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1}
                className="h-8 rounded-lg cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  trigger("light");
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                disabled={currentPage === totalPages}
                className="h-8 rounded-lg cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
