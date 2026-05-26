import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { reportService } from "../services/report-service";
import { parseCSV } from "../utils/report-utils";
import type { SortDirection } from "../types";

type ViewReportKind = "order" | "quotation";

const emptyHeaders: string[] = [];
const emptyRows: string[][] = [];

const config = {
  order: {
    backPath: "/order-report",
    missingMessage: "Required filter parameters not found. Please fill filters first.",
  },
  quotation: {
    backPath: "/quotation-report",
    missingMessage: "Required filter parameters not found. Please fill filters first.",
  },
};

export function useViewReport(kind: ViewReportKind) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortColIndex, setSortColIndex] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const reportQuery = useQuery({
    queryKey: ["reports", kind, "view"],
    queryFn: async () => {
      const csvText =
        kind === "order" ? await fetchOrderCSV(navigate) : await fetchQuotationCSV(navigate);
      const parsed = parseCSV(csvText);

      return {
        headers: parsed[0] || [],
        rows: parsed.length > 0 ? parsed.slice(1) : [],
      };
    },
  });

  const headers = reportQuery.data?.headers || emptyHeaders;
  const rows = reportQuery.data?.rows || emptyRows;

  useEffect(() => {
    if (reportQuery.isError) {
      console.error(`Error fetching ${kind} view report:`, reportQuery.error);
      toast.error("Failed to load view report data");
    }
  }, [kind, reportQuery.error, reportQuery.isError]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      row.some((cell) => String(cell || "").toLowerCase().includes(query)),
    );
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (sortColIndex === null) return 0;

      const aVal = a[sortColIndex] || "";
      const bVal = b[sortColIndex] || "";
      const aNum = Number(aVal.replace(/[^0-9.-]/g, ""));
      const bNum = Number(bVal.replace(/[^0-9.-]/g, ""));

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortColIndex, sortDirection]);

  const handleSort = (index: number) => {
    if (sortColIndex === index) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortColIndex(null);
      }
    } else {
      setSortColIndex(index);
      setSortDirection("asc");
    }
  };

  const goBack = () => navigate(config[kind].backPath);

  return {
    loading: reportQuery.isLoading,
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
  };
}

async function fetchOrderCSV(navigate: ReturnType<typeof useNavigate>) {
  const order_user_id = localStorage.getItem("order_user_id");
  const order_from_date = localStorage.getItem("order_from_date");
  const order_to_date = localStorage.getItem("order_to_date");
  const order_status = localStorage.getItem("order_status") || "";

  if (!order_user_id || !order_from_date || !order_to_date) {
    toast.error(config.order.missingMessage);
    navigate(config.order.backPath);
    return "";
  }

  return reportService.downloadOrderReport(
    { order_user_id, order_from_date, order_to_date, order_status },
    "text",
  );
}

async function fetchQuotationCSV(navigate: ReturnType<typeof useNavigate>) {
  const orders_user_id = localStorage.getItem("orders_user_id");
  const quotation_from_date = localStorage.getItem("quotation_from_date");
  const quotation_to_date = localStorage.getItem("quotation_to_date");
  const quotation_status = localStorage.getItem("quotation_status") || "";

  if (!orders_user_id || !quotation_from_date || !quotation_to_date) {
    toast.error(config.quotation.missingMessage);
    navigate(config.quotation.backPath);
    return "";
  }

  return reportService.downloadQuotationReport(
    { orders_user_id, quotation_from_date, quotation_to_date, quotation_status },
    "text",
  );
}
