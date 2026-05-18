"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { OrderProduct, UserProfile, CreateOrderInput } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Fetch users for dropdown
export function useUsersList() {
  return useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const response = await api.get<{ profile: UserProfile[] }>("/web-fetch-users");
      return response.data?.profile || [];
    },
  });
}

// Fetch products for order items selection
export function useProductsList() {
  return useQuery({
    queryKey: ["products-list"],
    queryFn: async () => {
      const response = await api.get<{ products: OrderProduct[] }>("/web-fetch-product");
      return response.data?.products || [];
    },
  });
}

// Fetch current year for order reference
export function useCurrentYear() {
  return useQuery({
    queryKey: ["current-year"],
    queryFn: async () => {
      const response = await api.get("/web-fetch-year");
      // Responds with res.data.year.current_year as in the old code
      return response.data?.year?.current_year || response.data?.year || "";
    },
  });
}

// Mutation to create order
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const response = await api.post("/web-create-order", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg || "Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create order";
      toast.error(errMsg);
    },
  });
}

// Fetch single order details by ID
export function useOrderDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ["order-by-id", id],
    queryFn: async () => {
      const response = await api.get<{ order: any; orderSub: any[] }>(`/web-fetch-order-by-Id/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Mutation to update/edit order
export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: any }) => {
      const response = await api.put<{ code: number; msg?: string }>(`/web-update-order/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg || "Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["pending-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["order-by-id"] });
      setTimeout(() => {
        router.push("/");
      }, 500);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update order";
      toast.error(errMsg);
    },
  });
}

