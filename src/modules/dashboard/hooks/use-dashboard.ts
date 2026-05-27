import { useState, useEffect, useMemo } from "react";
import { useWebHaptics } from "web-haptics/react";
import { toast } from "sonner";
import { useDashboardYears, useDashboardData } from "./use-dashboard-queries";

export function useDashboard() {
  const { trigger } = useWebHaptics();

  const [selectedYear, setSelectedYear] = useState<string>("2024-25");
  const [showTable, setShowTable] = useState(true);
  const [closeCategory, setCloseCategory] = useState(true);

  const [fullClose, setFullClose] = useState(true);
  const [fullCloseCategory, setFullCloseCategory] = useState(true);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // API Queries
  const { data: yearsData, isLoading: isLoadingYears } = useDashboardYears();
  const {
    data: dashboardData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    error,
    refetch,
  } = useDashboardData(selectedYear);

  // Safely extract available years array
  const availableYears = useMemo(() => {
    return yearsData
      ? [yearsData.current_year, yearsData.old_year].filter(Boolean)
      : ["2024-25", "2023-24"];
  }, [yearsData]);

  // Set default current year once loaded
  useEffect(() => {
    if (yearsData?.current_year) {
      setSelectedYear(yearsData.current_year);
    }
  }, [yearsData]);

  // Handle manual data refresh
  const handleReloadData = async () => {
    trigger("medium");
    try {
      await refetch();
      toast.success("Dashboard metrics refreshed");
    } catch (err) {
      toast.error("Failed to refresh metrics");
    }
  };

  // Carousel autoplay hook
  useEffect(() => {
    const products = dashboardData?.categoryBanner || [];
    if (products.length > 0 && closeCategory && fullCloseCategory) {
      const interval = setInterval(() => {
        setCarouselIndex((prev) =>
          prev === products.length - 1 ? 0 : prev + 1,
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [dashboardData?.categoryBanner, closeCategory, fullCloseCategory]);

  const handleNextSlide = () => {
    trigger("light");
    const products = dashboardData?.categoryBanner || [];
    if (products.length > 0) {
      setCarouselIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevSlide = () => {
    trigger("light");
    const products = dashboardData?.categoryBanner || [];
    if (products.length > 0) {
      setCarouselIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    }
  };

  // Client-side search filtration for orders
  const filteredOrders = useMemo(() => {
    const orders = dashboardData?.pendingOrder || [];
    if (!searchQuery.trim()) return orders;
    return orders.filter(
      (order) =>
        order.orders_no.toString().includes(searchQuery) ||
        order.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [dashboardData?.pendingOrder, searchQuery]);

  return {
    // States
    selectedYear,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    carouselIndex,
    setCarouselIndex,
    showTable,
    setShowTable,
    closeCategory,
    setCloseCategory,
    fullClose,
    setFullClose,
    fullCloseCategory,
    setFullCloseCategory,

    // Query outputs
    availableYears,
    dashboardData,
    filteredOrders,

    // Status flags
    isLoadingData: isLoadingData || isLoadingYears,
    isFetchingData,
    error,

    // Actions
    handleReloadData,
    handleNextSlide,
    handlePrevSlide,
    triggerHaptic: trigger,
  };
}
