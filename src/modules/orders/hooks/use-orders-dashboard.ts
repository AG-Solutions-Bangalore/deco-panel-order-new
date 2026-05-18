import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardDataResponse } from "../types";

// Fetch available dashboard years
export function useDashboardYears() {
  return useQuery({
    queryKey: ["dashboard-years"],
    queryFn: async () => {
      const response = await api.get("/web-fetch-year");
      return response.data?.year || response.data?.data || response.data;
    },
  });
}

// Fetch dashboard metrics and pending orders by selected year
export function useDashboardData(year: string) {
  return useQuery({
    queryKey: ["dashboard-data", year],
    queryFn: async () => {
      const response = await api.get<DashboardDataResponse>(`/web-fetch-dashboard-data-by/${year}`);
      return response.data;
    },
    enabled: !!year,
  });
}
