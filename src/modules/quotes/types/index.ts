export interface Quotation {
  id: number;
  full_name: string;
  quotation_no: number;
  quotation_date: string;
  quotation_status: string;
  order_user_id?: number | string;
  orders_user_id?: number | string;
  quotation_remarks?: string;
  quotation_delivery?: string;
  quotation_shipping?: string;
  quotation_count?: number;
}

export interface QuotationSubItem {
  id: number;
  quotation_sub_product_id: number | string;
  quotation_sub_quantity: number | string;
  quotation_sub_rate: number | string;
  quotation_sub_design_no: string;
  quotation_sub_thickness?: string;
  quotation_sub_unit?: string;
  quotation_sub_brand?: string;
  quotation_sub_size1?: number | string;
  quotation_sub_size2?: number | string;
  quotation_sub_size_unit?: string;
  quotation_sub_amount?: number | string;
  product_category?: string;
  product_sub_category?: string;
  last_rate?: number | string | null;
}

export interface QuotationDetailResponse {
  quotation: Quotation;
  quotationSub: QuotationSubItem[];
  quotationSubSum?: number;
}
