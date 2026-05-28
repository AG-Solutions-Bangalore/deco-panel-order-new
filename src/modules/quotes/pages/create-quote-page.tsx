import React, { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUsersList,
  useProductsList,
} from "@/modules/orders/hooks/use-create-order";
import {
  useOrderDetail,
  useCreateQuotationIndirectMutation,
  useFetchLastRateMutation,
} from "../hooks/use-quotes";
import SelectProductDialog from "@/modules/orders/components/SelectProductDialog";
import { OrderProduct } from "@/modules/orders/types";
import {
  ArrowLeft,
  User,
  Calendar,
  Plus,
  Trash2,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { formatOrderDate } from "@/modules/orders/utils/date";

interface CreateQuotePageProps {
  orderId: string;
}

type QuoteOrderSubItem = {
  id?: number | string;
  orders_sub_product_id?: number | string;
  orders_sub_quantity?: number | string;
  orders_sub_rate?: number | string;
  orders_sub_design_no?: string;
};

type QuoteItem = {
  orders_sub_product_id: string | number;
  orders_sub_quantity: string | number;
  orders_sub_rate: string | number;
  orders_sub_design_no: string;
  id?: number | string;
  last_rate?: number | string | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

export function CreateQuotePage({ orderId }: CreateQuotePageProps) {
  const navigate = useNavigate();
  const { trigger } = useWebHaptics();

  // Parallel Query Fetching
  const { data: orderData, isLoading: isLoadingOrder } =
    useOrderDetail(orderId);
  const { data: users = [], isLoading: isLoadingUsers } = useUsersList();
  const { data: products = [], isLoading: isLoadingProducts } =
    useProductsList();

  // Mutations
  const createMutation = useCreateQuotationIndirectMutation();
  const { mutateAsync: fetchLastRateMutation } = useFetchLastRateMutation();

  // Form State
  const [orderState, setOrderState] = useState({
    orders_user_id: "",
    orders_date: "",
    orders_status: "",
    orders_count: 0,
  });

  const [items, setItems] = useState<QuoteItem[]>([
    {
      orders_sub_product_id: "",
      orders_sub_quantity: "",
      orders_sub_rate: "",
      orders_sub_design_no: "",
    },
  ]);

  // Dialog State
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const fetchLastRate = useCallback(
    async (
      userId: number | string,
      productId: number | string,
      index: number,
    ) => {
      if (!userId || !productId) return;
      try {
        const lastRate = await fetchLastRateMutation({ userId, productId });
        setItems((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  last_rate: lastRate,
                  orders_sub_rate:
                    !item.orders_sub_rate && lastRate
                      ? lastRate
                      : item.orders_sub_rate,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error("Error fetching last paid rate:", error);
      }
    },
    [fetchLastRateMutation],
  );

  // Sync state when orderData loads
  useEffect(() => {
    if (orderData) {
      setOrderState({
        orders_user_id: String(orderData.order?.orders_user_id || ""),
        orders_date: orderData.order?.orders_date || "",
        orders_status: orderData.order?.orders_status || "",
        orders_count: orderData.order?.orders_count || 0,
      });

      if (orderData.orderSub && orderData.orderSub.length > 0) {
        const formattedSub = orderData.orderSub.map(
          (sub: QuoteOrderSubItem) => ({
            orders_sub_product_id: sub.orders_sub_product_id || "",
            orders_sub_quantity: sub.orders_sub_quantity || "",
            orders_sub_rate: sub.orders_sub_rate || "",
            orders_sub_design_no: sub.orders_sub_design_no || "",
            id: sub.id,
            last_rate: null,
          }),
        );
        setItems(formattedSub);

        // Fetch last rate for pre-populated items
        formattedSub.forEach((item, idx) => {
          if (orderData.order?.orders_user_id && item.orders_sub_product_id) {
            fetchLastRate(
              orderData.order.orders_user_id,
              item.orders_sub_product_id,
              idx,
            );
          }
        });
      }
    }
  }, [fetchLastRate, orderData]);

  const handleOpenProductDialog = (index: number) => {
    trigger("light");
    setActiveItemIndex(index);
    setProductDialogOpen(true);
  };

  const handleProductSelect = (product: OrderProduct) => {
    if (activeItemIndex === null) return;
    trigger("medium");

    setItems((prev) =>
      prev.map((item, idx) =>
        idx === activeItemIndex
          ? { ...item, orders_sub_product_id: String(product.id) }
          : item,
      ),
    );

    setProductDialogOpen(false);

    // Fetch last paid rate for this customer and product
    if (orderState.orders_user_id) {
      fetchLastRate(orderState.orders_user_id, product.id, activeItemIndex);
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleAddItem = () => {
    trigger("light");
    setItems((prev) => [
      ...prev,
      {
        orders_sub_product_id: "",
        orders_sub_quantity: "",
        orders_sub_rate: "",
        orders_sub_design_no: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    trigger("medium");
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const getProductLabel = (productId: string | number) => {
    const prod = products.find((p) => String(p.id) === String(productId));
    if (!prod) return "Click to Select Product...";
    return `${prod.product_sub_category} (Category: ${prod.product_category}) - Brand: ${prod.products_brand} (${prod.products_thickness}MM, ${prod.products_size1}x${prod.products_size2})`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger("heavy");

    // Validations
    if (
      items.some(
        (item) =>
          !item.orders_sub_product_id ||
          !item.orders_sub_quantity ||
          !item.orders_sub_rate,
      )
    ) {
      toast.error("Please fill out all product, quantity, and rate fields.");
      return;
    }

    createMutation.mutate(
      {
        id: orderId,
        payload: {
          orders_status: orderState.orders_status,
          order_sub_data: items,
          orders_count: orderState.orders_count,
        },
      },
      {
        onSuccess: (res) => {
          if (res.code === 200) {
            toast.success("Quotation drafted successfully!");
            navigate("/quotes");
          } else {
            toast.error(res.msg || "Failed to create quotation");
          }
        },
        onError: (err: unknown) => {
          toast.error(getErrorMessage(err, "Error submitting quotation"));
        },
      },
    );
  };

  if (isLoadingOrder || isLoadingUsers || isLoadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner className="size-8 text-primary animate-spin" />
        <p className="text-xs text-text-muted font-bold animate-pulse">
          Retrieving order details...
        </p>
      </div>
    );
  }

  const selectedCustomerName =
    users.find((u) => String(u.id) === String(orderState.orders_user_id))
      ?.full_name || "Unknown Customer";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-panel border border-border/80 text-text hover:text-primary hover:bg-primary/5 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <PageHeader
          title="Add Quotation"
          subtitle={`Draft indirect quotation based on Order #${orderId}`}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-6"
      >
        {/* Read-Only Details */}
        <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl relative pt-0">
          <CardContent className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 select-none">
                <User className="size-3.5 text-primary" />
                Customer
              </label>
              <Input
                value={selectedCustomerName}
                readOnly
                className="bg-muted/10 border-border/80 cursor-not-allowed font-semibold text-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Calendar className="size-3.5 text-primary" />
                Order Date
              </label>
              <Input
                value={formatOrderDate(orderState.orders_date)}
                readOnly
                className="bg-muted/10 border-border/80 cursor-not-allowed font-semibold text-text"
              />
            </div>
          </CardContent>
        </Card>

        {/* Item rows heading */}
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-base font-extrabold text-text flex items-center gap-2">
            📋 Quotation Items ({items.length})
          </h3>
          <Button
            type="button"
            onClick={handleAddItem}
            className="cursor-pointer text-xs font-bold gap-1 rounded-xl"
            variant="outline"
            size="sm"
          >
            <Plus className="size-3.5" /> Add Row
          </Button>
        </div>

        {/* Items Container */}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <Card
              key={index}
              className="bg-panel border border-border/80 hover:border-border-hover shadow-xs rounded-2xl overflow-hidden pt-0 transition-all"
            >
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Desktop and Mobile Dual-layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Product field - takes 5 cols on desktop */}
                  <div className="md:col-span-5 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                      <span>Product *</span>
                      <span className="text-[10px] text-primary">
                        Row {index + 1}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenProductDialog(index)}
                      className="w-full min-h-12 bg-background border border-border hover:border-border-hover focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none transition-all cursor-pointer text-left flex items-start text-text"
                    >
                      <span
                        className={`leading-5 overflow-hidden break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] ${
                          item.orders_sub_product_id
                            ? "text-text"
                            : "text-text-muted font-normal"
                        }`}
                      >
                        {getProductLabel(item.orders_sub_product_id)}
                      </span>
                    </button>
                  </div>

                  {/* Quantity - 2 cols on desktop */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Quantity *
                    </label>
                    <Input
                      type="text"
                      placeholder="Qty"
                      required
                      value={item.orders_sub_quantity}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          handleItemChange(index, "orders_sub_quantity", val);
                        }
                      }}
                      className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
                    />
                  </div>

                  {/* Rate - 2 cols on desktop */}
                  <div className="md:col-span-2 flex flex-col gap-1.5 relative">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Rate *
                    </label>
                    <Input
                      type="text"
                      placeholder="Rate"
                      required
                      value={item.orders_sub_rate}
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          handleItemChange(index, "orders_sub_rate", val);
                        }
                      }}
                      className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
                    />
                    {item.last_rate !== undefined &&
                      item.last_rate !== null && (
                        <span className="absolute top-[calc(100%+2px)] left-0 text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                          Last Rate: {item.last_rate}
                        </span>
                      )}
                  </div>

                  {/* Design No - 2 cols on desktop */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Design No
                    </label>
                    <Input
                      placeholder="Design #"
                      value={item.orders_sub_design_no}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "orders_sub_design_no",
                          e.target.value,
                        )
                      }
                      className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
                    />
                  </div>

                  {/* Actions - 1 col on desktop */}
                  {items.length > 1 && (
                    <div className="md:col-span-1 flex items-center justify-end md:justify-center md:h-16 pt-2 md:pt-4">
                      <Button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        variant="ghost"
                        size="icon"
                        className="text-text-muted hover:text-rose-500 hover:bg-rose-500/5 rounded-full cursor-pointer transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link to="/">
            <Button
              type="button"
              variant="outline"
              className="px-6 rounded-xl cursor-pointer"
            >
              Back to Orders
            </Button>
          </Link>
          <Button
            type="submit"
            className="px-6 rounded-xl cursor-pointer"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? "Submitting Proposal..."
              : "Submit Quotation"}
          </Button>
        </div>
      </form>

      {/* Reused Product Drawer Selection */}
      <SelectProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        products={products}
        isLoading={isLoadingProducts}
        onSelect={handleProductSelect}
      />
    </div>
  );
}
