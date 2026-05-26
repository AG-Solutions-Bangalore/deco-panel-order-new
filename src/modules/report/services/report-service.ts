import api from "@/lib/api";
import { withProductSizeUnit } from "@/utils/product";
import type {
  ClientsResponse,
  OrderReportPayload,
  ProductReportResponse,
  QuotationReportPayload,
} from "../types";

export const reportService = {
  async fetchClients() {
    const response = await api.get<ClientsResponse>("/web-fetch-users");
    return response.data?.profile || [];
  },

  async fetchProductReport() {
    const response = await api.get<ProductReportResponse>("/web-fetch-product-report-list");
    return (response.data?.products || []).map(withProductSizeUnit);
  },

  async downloadOrderReport(payload: OrderReportPayload, responseType: "blob" | "text" = "blob") {
    const response = await api.post("/download-order-report", payload, { responseType });
    return response.data;
  },

  async downloadQuotationReport(
    payload: QuotationReportPayload,
    responseType: "blob" | "text" = "blob",
  ) {
    const response = await api.post("/download-quotation-report", payload, { responseType });
    return response.data;
  },
};
