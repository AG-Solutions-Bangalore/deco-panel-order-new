import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Category, SubCategory, Brand, Product } from "../types";
import { withProductSizeUnit } from "@/utils/product";

// ==========================================
// CATEGORIES HOOKS
// ==========================================

export function useCategoriesList() {
  return useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => {
      const response = await api.get<{ productCategoryList: Category[] }>("/web-fetch-category-list");
      const data = response.data;
      const list = data?.productCategoryList || (data as any)?.productCategory || (data as any)?.category || (data as any)?.categories || data;
      const normalizedList = Array.isArray(list) ? list : [];
      return normalizedList.map((c: any) => ({
        ...c,
        id: c.id ?? c.product_category_id ?? c.category_id ?? c.product_catg_id
      }));
    },
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: ["active-categories"],
    queryFn: async () => {
      const response = await api.get<{ productCategory: Category[] }>("/web-fetch-category");
      const data = response.data;
      const list = data?.productCategory || (data as any)?.productCategoryList || (data as any)?.category || (data as any)?.categories || data;
      const normalizedList = Array.isArray(list) ? list : [];
      return normalizedList.map((c: any) => ({
        ...c,
        id: c.id ?? c.product_category_id ?? c.category_id ?? c.product_catg_id
      }));
    },
  });
}

export function useCategoryDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await api.get<{ productCategory: Category }>(`/web-fetch-category-by-Id/${id}`);
      const data = response.data;
      const rawCategory = data?.productCategory || (data as any)?.category || (data as any)?.productCategoryList || data;
      const finalCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
      if (finalCategory) {
        finalCategory.id = finalCategory.id ?? finalCategory.product_category_id ?? finalCategory.category_id ?? finalCategory.product_catg_id;
      }
      return finalCategory;
    },
    enabled: !!id,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/web-create-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Category created successfully");
        queryClient.invalidateQueries({ queryKey: ["categories-list"] });
        queryClient.invalidateQueries({ queryKey: ["active-categories"] });
        navigate("/categories");
      } else {
        toast.error(data?.msg || "Failed to create category");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create category";
      toast.error(errMsg);
    },
  });
}

export function useUpdateCategoryMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(`/web-update-category/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["categories-list"] });
        queryClient.invalidateQueries({ queryKey: ["active-categories"] });
        queryClient.invalidateQueries({ queryKey: ["category", id] });
        navigate("/categories");
      } else {
        toast.error(data?.msg || "Failed to update category");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update category";
      toast.error(errMsg);
    },
  });
}

// ==========================================
// SUB-CATEGORIES HOOKS
// ==========================================

export function useSubCategoriesList() {
  return useQuery({
    queryKey: ["subcategories-list"],
    queryFn: async () => {
      const response = await api.get<{ productSubCategoryList: SubCategory[] }>("/web-fetch-sub-category-list");
      const data = response.data;
      const list = data?.productSubCategoryList || (data as any)?.productSubCategory || (data as any)?.subCategory || (data as any)?.subCategories || data;
      const normalizedList = Array.isArray(list) ? list : [];
      return normalizedList.map((s: any) => ({
        ...s,
        id: s.id ?? s.product_sub_category_id ?? s.sub_category_id ?? s.products_sub_catg_id
      }));
    },
  });
}

export function useSubCategoryDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ["subcategory", id],
    queryFn: async () => {
      const response = await api.get<{ productSubCategory: SubCategory }>(`/web-fetch-sub-category-by-Id/${id}`);
      const data = response.data;
      const rawSub = data?.productSubCategory || (data as any)?.subCategory || (data as any)?.productSubCategoryList || data;
      const finalSub = Array.isArray(rawSub) ? rawSub[0] : rawSub;
      if (finalSub) {
        finalSub.id = finalSub.id ?? finalSub.product_sub_category_id ?? finalSub.sub_category_id ?? finalSub.products_sub_catg_id;
        finalSub.product_category_id = finalSub.product_category_id ?? finalSub.products_catg_id ?? finalSub.category_id;
      }
      return finalSub;
    },
    enabled: !!id,
  });
}

export function useActiveSubCategoriesByCategory(categoryId: number | string | undefined) {
  return useQuery({
    queryKey: ["active-subcategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await api.get<{ productSubCategory: SubCategory[] }>(`/web-fetch-sub-category/${categoryId}`);
      const data = response.data;
      const list = data?.productSubCategory || (data as any)?.productSubCategoryList || (data as any)?.subCategory || (data as any)?.subCategories || data;
      const normalizedList = Array.isArray(list) ? list : [];
      return normalizedList.map((s: any) => ({
        ...s,
        id: s.id ?? s.product_sub_category_id ?? s.sub_category_id ?? s.products_sub_catg_id
      }));
    },
    enabled: !!categoryId,
  });
}

export function useCreateSubCategoryMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/web-create-sub-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Sub Category created successfully");
        queryClient.invalidateQueries({ queryKey: ["subcategories-list"] });
        queryClient.invalidateQueries({ queryKey: ["active-subcategories"] });
        navigate("/sub-categories");
      } else {
        toast.error(data?.msg || "Failed to create sub category");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create sub category";
      toast.error(errMsg);
    },
  });
}

export function useUpdateSubCategoryMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(`/web-update-sub-category/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Sub Category updated successfully");
        queryClient.invalidateQueries({ queryKey: ["subcategories-list"] });
        queryClient.invalidateQueries({ queryKey: ["active-subcategories"] });
        queryClient.invalidateQueries({ queryKey: ["subcategory", id] });
        navigate("/sub-categories");
      } else {
        toast.error(data?.msg || "Failed to update sub category");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update sub category";
      toast.error(errMsg);
    },
  });
}

// ==========================================
// BRANDS HOOKS
// ==========================================

const extractBrandId = (brand: any) =>
  brand?.id ??
  brand?.brands_id ??
  brand?.brand_id ??
  brand?.brandId ??
  brand?.brandsId ??
  brand?.brandID ??
  brand?.brandsID;

const normalizeBrand = (brand: any): Brand => ({
  ...brand,
  id: extractBrandId(brand),
  brands_name: brand?.brands_name ?? brand?.brand_name ?? brand?.name ?? "",
  brands_image: brand?.brands_image ?? brand?.brand_image ?? brand?.image ?? null,
  brands_status: brand?.brands_status ?? brand?.brand_status ?? brand?.status ?? "Active",
  brands_sort: brand?.brands_sort ?? brand?.brand_sort ?? brand?.sort_order ?? brand?.sort,
});

const extractBrands = (data: any) => {
  const list = data?.brandsList ?? data?.brandList ?? data?.brands ?? data?.brand ?? data;
  return Array.isArray(list) ? list : [];
};

export function useBrandsList() {
  return useQuery({
    queryKey: ["brands-list"],
    queryFn: async () => {
      const response = await api
        .get("/web-fetch-brand-list")
        .catch(() => api.get<{ brands: Brand[] }>("/web-fetch-brand"));
      return extractBrands(response.data).map(normalizeBrand);
    },
  });
}

export function useBrandDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: async () => {
      const response = await api.get<{ brands: Brand }>(`/web-fetch-brand-by-Id/${id}`);
      const data = response.data;
      const rawBrand = data?.brands || (data as any)?.brand || (data as any)?.brandList || data;
      const finalBrand = Array.isArray(rawBrand) ? rawBrand[0] : rawBrand;
      return finalBrand ? normalizeBrand(finalBrand) : finalBrand;
    },
    enabled: !!id && id !== "undefined",
  });
}

export function useCreateBrandMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/web-create-brand", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Brand created successfully");
        queryClient.invalidateQueries({ queryKey: ["brands-list"] });
        navigate("/brand");
      } else {
        toast.error(data?.msg || "Failed to create brand");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create brand";
      toast.error(errMsg);
    },
  });
}

export function useUpdateBrandMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(`/web-update-brand/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Brand updated successfully");
        queryClient.invalidateQueries({ queryKey: ["brands-list"] });
        queryClient.invalidateQueries({ queryKey: ["brand", id] });
        navigate("/brand");
      } else {
        toast.error(data?.msg || "Failed to update brand");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update brand";
      toast.error(errMsg);
    },
  });
}

// ==========================================
// PRODUCTS HOOKS
// ==========================================

export function useProductsList() {
  return useQuery({
    queryKey: ["products-list"],
    queryFn: async () => {
      const response = await api.get<{ products: Product[] }>("/web-fetch-product-list");
      const list = response.data?.products || [];
      return list.map((p: any) => ({
        ...withProductSizeUnit(p),
        id: p.id ?? p.product_id ?? p.products_id,
      }));
    },
  });
}

export function useProductDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get<{ products: Product }>(`/web-fetch-product-by-Id/${id}`);
      const data = response.data;
      const rawProduct = data?.products || (data as any)?.product || (data as any)?.productList || data;
      const finalProduct = Array.isArray(rawProduct) ? rawProduct[0] : rawProduct;
      if (finalProduct) {
        finalProduct.id = finalProduct.id ?? finalProduct.product_id ?? finalProduct.products_id;
        finalProduct.products_catg_id = finalProduct.products_catg_id ?? finalProduct.product_category_id ?? finalProduct.category_id;
        finalProduct.products_sub_catg_id = finalProduct.products_sub_catg_id ?? finalProduct.product_sub_category_id ?? finalProduct.sub_category_id;
        finalProduct.products_size_unit = withProductSizeUnit(finalProduct).products_size_unit;
      }
      return finalProduct;
    },
    enabled: !!id,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/web-create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Product created successfully");
        queryClient.invalidateQueries({ queryKey: ["products-list"] });
        navigate("/products");
      } else {
        toast.error(data?.msg || "Failed to create product");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to create product";
      toast.error(errMsg);
    },
  });
}

export function useUpdateProductMutation(id: number | string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(`/web-update-product/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.code === 200) {
        toast.success(data?.msg || "Product updated successfully");
        queryClient.invalidateQueries({ queryKey: ["products-list"] });
        queryClient.invalidateQueries({ queryKey: ["product", id] });
        navigate("/products");
      } else {
        toast.error(data?.msg || "Failed to update product");
      }
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.message || error.message || "Failed to update product";
      toast.error(errMsg);
    },
  });
}
