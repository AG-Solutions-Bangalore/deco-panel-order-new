import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportService } from "../services/report-service";
import type { ProductReportItem, SortDirection } from "../types";

const emptyProducts: ProductReportItem[] = [];

export function useProductReport() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof ProductReportItem | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const productReportQuery = useQuery({
    queryKey: ["reports", "products"],
    queryFn: reportService.fetchProductReport,
  });

  const products = productReportQuery.data || emptyProducts;

  useEffect(() => {
    if (productReportQuery.isError) {
      const error = productReportQuery.error as any;
      const errorMsg = error.response?.data?.message || "Failed to fetch product report";
      toast.error(errorMsg);
      console.error("Error fetching product report:", error);
    }
  }, [productReportQuery.error, productReportQuery.isError]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [
        product.product_category,
        product.product_sub_category,
        product.products_brand,
        product.product_status,
      ].some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [products, search]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (!sortField) return 0;

      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue === undefined || aValue === null) aValue = "";
      if (bValue === undefined || bValue === null) bValue = "";

      if (
        sortField === "products_rate" ||
        sortField === "products_thickness" ||
        sortField === "products_size1"
      ) {
        const aNum = parseFloat(String(aValue).replace(/[^0-9.-]/g, "")) || 0;
        const bNum = parseFloat(String(bValue).replace(/[^0-9.-]/g, "")) || 0;
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sortDirection === "asc" ? -1 : 1;
      if (aString > bString) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortDirection, sortField]);

  const handleSort = (field: keyof ProductReportItem) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSortField(null);
  };

  return {
    products,
    loading: productReportQuery.isLoading,
    isFetching: productReportQuery.isFetching,
    refetch: productReportQuery.refetch,
    search,
    setSearch,
    sortField,
    sortDirection,
    sortedProducts,
    handleSort,
    clearFilters,
  };
}
