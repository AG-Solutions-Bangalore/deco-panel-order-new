import { useState } from "react";
import {
  useDashboardData,
  useDashboardYears,
  usePendingOrdersList,
  useProcessedOrdersList,
} from "./use-orders-dashboard";

export function useOrderList() {
  const [selectedYear, setSelectedYear] = useState<string>("2024-25");
  const [activeTab, setActiveTab] = useState<string>("recent");
  
  const { data: dashboardData, isLoading: isLoadingData, error: dashboardError } = useDashboardData(selectedYear);
  const { data: availableYears, isLoading: isLoadingYears } = useDashboardYears();
  const { data: pendingOrders = [], isLoading: isLoadingPending, error: pendingError } = usePendingOrdersList();
  const { data: processedOrders = [], isLoading: isLoadingProcessed, error: processedError } = useProcessedOrdersList();

  return {
    selectedYear,
    setSelectedYear,
    activeTab,
    setActiveTab,
    dashboardData,
    pendingOrders,
    processedOrders,
    isLoadingData: isLoadingData || isLoadingYears,
    isLoadingPending,
    isLoadingProcessed,
    availableYears: availableYears || [],
    error: dashboardError || pendingError || processedError,
  };
}
