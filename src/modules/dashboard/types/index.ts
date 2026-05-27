export interface PendingOrder {
  id: number;
  full_name: string;
  orders_no: number;
  orders_date: string;
  orders_status: string;
}

export interface CategoryBanner {
  product_category: string;
  product_category_image: string;
}

export interface DashboardDataResponse {
  productsCount: number;
  ordersCount: number;
  usersCount: number;
  pendingOrder: PendingOrder[];
  categoryBanner: CategoryBanner[];
}
