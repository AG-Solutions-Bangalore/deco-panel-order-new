export interface ClientUser {
  id: number | string;
  full_name: string;
}

export interface ProductReportItem {
  id: number | string;
  product_category: string;
  product_sub_category: string;
  products_brand: string;
  products_thickness: string | number | null;
  products_unit: string | null;
  products_size1: string | number | null;
  products_size2: string | number | null;
  products_size_unit?: string | null;
  products_rate: string | number | null;
  product_status: string;
}

export interface ProductReportResponse {
  products: ProductReportItem[];
}

export interface ClientsResponse {
  profile: ClientUser[];
}

export interface OrderReportPayload {
  order_user_id: string;
  order_from_date: string;
  order_to_date: string;
  order_status: string;
}

export interface QuotationReportPayload {
  orders_user_id: string;
  quotation_from_date: string;
  quotation_to_date: string;
  quotation_status: string;
}

export type SortDirection = "asc" | "desc";
