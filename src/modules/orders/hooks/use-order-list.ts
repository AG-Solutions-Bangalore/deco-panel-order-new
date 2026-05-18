"use client";

import { useState } from "react";
import { useDashboardData, useDashboardYears } from "./use-orders-dashboard";

export function useOrderList() {
  const [selectedYear, setSelectedYear] = useState<string>("2024-25");
  
  const { data: dashboardData, isLoading: isLoadingData, error } = useDashboardData(selectedYear);
  const { data: availableYears, isLoading: isLoadingYears } = useDashboardYears();

  return {
    selectedYear,
    setSelectedYear,
    dashboardData,
    isLoadingData: isLoadingData || isLoadingYears,
    availableYears: availableYears || [],
    error,
  };
}
