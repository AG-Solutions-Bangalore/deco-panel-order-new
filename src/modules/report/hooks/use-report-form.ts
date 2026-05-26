import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { reportService } from "../services/report-service";
import type { ClientUser } from "../types";
import { downloadBlob, formatToYMD } from "../utils/report-utils";

type ReportKind = "order" | "quotation";

const reportConfig = {
  order: {
    downloadFilename: "order_list.csv",
    successMessage: "Order detailed report downloaded successfully",
    viewPath: "/order-view-report",
  },
  quotation: {
    downloadFilename: "quotation-report.csv",
    successMessage: "Quotation report downloaded successfully",
    viewPath: "/quotation-view-report",
  },
};

export function useReportForm(kind: ReportKind) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date("2023-03-01"));
  const [toDate, setToDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState("");

  const clientsQuery = useQuery<ClientUser[]>({
    queryKey: ["reports", "clients"],
    queryFn: reportService.fetchClients,
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (kind === "order") {
        return reportService.downloadOrderReport(getOrderPayload(), "blob");
      }

      return reportService.downloadQuotationReport(getQuotationPayload(), "blob");
    },
    onMutate: () => {
      toast.loading("Preparing report download...", { id: "download-toast" });
    },
    onSuccess: (data) => {
      downloadBlob(data, reportConfig[kind].downloadFilename);
      toast.success(reportConfig[kind].successMessage, { id: "download-toast" });
    },
    onError: (error) => {
      console.error(`Error downloading ${kind} report:`, error);
      toast.error(`Failed to download ${kind} report`, { id: "download-toast" });
    },
  });

  useEffect(() => {
    if (clientsQuery.isError) {
      console.error("Error fetching clients:", clientsQuery.error);
      toast.error("Failed to load clients list");
    }
  }, [clientsQuery.error, clientsQuery.isError]);

  const getOrderPayload = () => ({
    order_user_id: userId,
    order_from_date: formatToYMD(fromDate),
    order_to_date: formatToYMD(toDate),
    order_status: status,
  });

  const getQuotationPayload = () => ({
    orders_user_id: userId,
    quotation_from_date: formatToYMD(fromDate),
    quotation_to_date: formatToYMD(toDate),
    quotation_status: status,
  });

  const downloadReport = async (event: FormEvent) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Please select a client first");
      return;
    }

    await downloadMutation.mutateAsync();
  };

  const viewReport = (event: FormEvent) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Please select a client first");
      return;
    }

    if (kind === "order") {
      const payload = getOrderPayload();
      localStorage.setItem("order_user_id", payload.order_user_id);
      localStorage.setItem("order_from_date", payload.order_from_date);
      localStorage.setItem("order_to_date", payload.order_to_date);
      localStorage.setItem("order_status", payload.order_status);
    } else {
      const payload = getQuotationPayload();
      localStorage.setItem("orders_user_id", payload.orders_user_id);
      localStorage.setItem("quotation_from_date", payload.quotation_from_date);
      localStorage.setItem("quotation_to_date", payload.quotation_to_date);
      localStorage.setItem("quotation_status", payload.quotation_status);
    }

    navigate(reportConfig[kind].viewPath);
  };

  return {
    userId,
    setUserId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    clients: clientsQuery.data || [],
    loadingClients: clientsQuery.isLoading,
    downloading: downloadMutation.isPending,
    downloadReport,
    viewReport,
  };
}
