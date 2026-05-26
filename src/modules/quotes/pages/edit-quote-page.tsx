import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsersList, useProductsList } from "@/modules/orders/hooks/use-create-order";
import { useQuotationDetail, useUpdateQuotationMutation } from "../hooks/use-quotes";
import SelectProductDialog from "@/modules/orders/components/SelectProductDialog";
import { OrderProduct } from "@/modules/orders/types";
import { ArrowLeft, User, Calendar, Plus, Trash2, Edit3, Settings } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { formatQuotationDate } from "../utils/date";

interface EditQuotePageProps {
  quoteId: string;
}

export function EditQuotePage({ quoteId }: EditQuotePageProps) {
  const navigate = useNavigate();
  const { trigger } = useWebHaptics();

  // Queries
  const { data: quoteData, isLoading: isLoadingQuote } = useQuotationDetail(quoteId);
  const { data: users = [], isLoading: isLoadingUsers } = useUsersList();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsList();

  // Mutations
  const updateMutation = useUpdateQuotationMutation();

  // Form State
  const [quotation, setQuotation] = useState({
    order_user_id: "",
    quotation_date: "",
    quotation_status: "",
    quotation_count: 0,
    quotation_remarks: "",
    quotation_delivery: "",
    quotation_shipping: "",
  });

  const [items, setItems] = useState<Array<{
    quotation_sub_product_id: string | number;
    quotation_sub_quantity: string | number;
    quotation_sub_rate: string | number;
    quotation_sub_design_no: string;
    id?: number | string;
  }>>([
    {
      quotation_sub_product_id: "",
      quotation_sub_quantity: "",
      quotation_sub_rate: "",
      quotation_sub_design_no: "",
    },
  ]);

  // Dialog State
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Sync state when quoteData loads
  useEffect(() => {
    if (quoteData) {
      setQuotation({
        order_user_id: String(quoteData.quotation?.order_user_id || ""),
        quotation_date: quoteData.quotation?.quotation_date || "",
        quotation_status: quoteData.quotation?.quotation_status || "",
        quotation_count: quoteData.quotation?.quotation_count || 0,
        quotation_remarks: quoteData.quotation?.quotation_remarks || "",
        quotation_delivery: quoteData.quotation?.quotation_delivery || "",
        quotation_shipping: quoteData.quotation?.quotation_shipping || "",
      });

      if (quoteData.quotationSub && quoteData.quotationSub.length > 0) {
        const formattedSub = quoteData.quotationSub.map((sub: any) => ({
          quotation_sub_product_id: sub.quotation_sub_product_id || "",
          quotation_sub_quantity: sub.quotation_sub_quantity || "",
          quotation_sub_rate: sub.quotation_sub_rate || "",
          quotation_sub_design_no: sub.quotation_sub_design_no || "",
          id: sub.id,
        }));
        setItems(formattedSub);
      }
    }
  }, [quoteData]);

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
          ? { ...item, quotation_sub_product_id: String(product.id) }
          : item
      )
    );
    setProductDialogOpen(false);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = () => {
    trigger("light");
    setItems((prev) => [
      ...prev,
      {
        quotation_sub_product_id: "",
        quotation_sub_quantity: "",
        quotation_sub_rate: "",
        quotation_sub_design_no: "",
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

  const handleInputChange = (field: string, value: string) => {
    setQuotation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger("heavy");

    // Validations
    if (items.some((item) => !item.quotation_sub_product_id || !item.quotation_sub_quantity || !item.quotation_sub_rate)) {
      toast.error("Please fill out all product, quantity, and rate fields.");
      return;
    }

    if (!quotation.quotation_status) {
      toast.error("Please select a status for the quotation.");
      return;
    }

    updateMutation.mutate(
      {
        id: quoteId,
        payload: {
          quotation_status: quotation.quotation_status,
          quotation_sub_data: items,
          quotation_count: quotation.quotation_count,
          quotation_remarks: quotation.quotation_remarks,
          quotation_delivery: quotation.quotation_delivery,
          quotation_shipping: quotation.quotation_shipping,
        },
      },
      {
        onSuccess: (res) => {
          if (res.code === 200) {
            toast.success("Quotation updated successfully!");
            navigate("/quotes");
          } else {
            toast.error(res.msg || "Failed to update quotation");
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Error updating quotation");
        },
      }
    );
  };

  if (isLoadingQuote || isLoadingUsers || isLoadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner className="size-8 text-primary animate-spin" />
        <p className="text-xs text-text-muted font-bold animate-pulse">Retrieving quotation details...</p>
      </div>
    );
  }

  const selectedCustomerName =
    users.find((u) => String(u.id) === String(quotation.order_user_id))?.full_name ||
    users.find((u) => String(u.id) === String(quotation.order_user_id))?.user_name ||
    "Unknown Customer";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link to="/quotes">
          <Button variant="ghost" size="icon" className="rounded-full bg-panel border border-border/80 text-text hover:text-primary hover:bg-primary/5 cursor-pointer">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <PageHeader title="Edit Quotation" subtitle={`Modifying proposal details for Quote #${quoteId}`} />
      </div>

      <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-6">
        {/* Main Details and Status */}
        <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl relative pt-0">
          <CardContent className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
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
                Date
              </label>
              <Input
                value={formatQuotationDate(quotation.quotation_date)}
                readOnly
                className="bg-muted/10 border-border/80 cursor-not-allowed font-semibold text-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Settings className="size-3.5 text-primary" />
                Status *
              </label>
              <Select
                value={quotation.quotation_status}
                onValueChange={(val) => handleInputChange("quotation_status", val)}
              >
                <SelectTrigger className="w-full bg-background border border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border rounded-xl shadow-md z-50">
                  <SelectItem value="Quotation" className="cursor-pointer font-semibold hover:bg-primary/5">Quotation</SelectItem>
                  <SelectItem value="Cancel" className="cursor-pointer font-semibold hover:bg-primary/5 text-rose-500">Cancel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Remarks, Delivery, and Shipping Addresses */}
        <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl relative pt-0">
          <CardContent className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider select-none">
                Remark
              </label>
              <Input
                value={quotation.quotation_remarks}
                onChange={(e) => handleInputChange("quotation_remarks", e.target.value)}
                maxLength={200}
                placeholder="Enter remarks..."
                className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider select-none">
                Delivery Address
              </label>
              <Input
                value={quotation.quotation_delivery}
                onChange={(e) => handleInputChange("quotation_delivery", e.target.value)}
                maxLength={200}
                placeholder="Delivery instructions..."
                className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider select-none">
                Billing Address
              </label>
              <Input
                value={quotation.quotation_shipping}
                onChange={(e) => handleInputChange("quotation_shipping", e.target.value)}
                maxLength={200}
                placeholder="Billing instructions..."
                className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* Item Rows heading */}
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

        {/* Dynamic sub items editing */}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <Card key={index} className="bg-panel border border-border/80 hover:border-border-hover shadow-xs rounded-2xl overflow-hidden pt-0 transition-all">
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Product Field */}
                  <div className="md:col-span-5 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                      <span>Product *</span>
                      <span className="text-[10px] text-primary">Row {index + 1}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenProductDialog(index)}
                      className="w-full min-h-12 bg-background border border-border hover:border-border-hover focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none transition-all cursor-pointer text-left flex items-start text-text"
                    >
                      <span
                        className={`leading-5 overflow-hidden break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] ${
                          item.quotation_sub_product_id
                            ? "text-text"
                            : "text-text-muted font-normal"
                        }`}
                      >
                        {getProductLabel(item.quotation_sub_product_id)}
                      </span>
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      required
                      value={item.quotation_sub_quantity}
                      onChange={(e) => handleItemChange(index, "quotation_sub_quantity", e.target.value)}
                      className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
                    />
                  </div>

                  {/* Rate */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Rate *
                    </label>
                    <Input
                      type="number"
                      placeholder="Rate"
                      required
                      value={item.quotation_sub_rate}
                      onChange={(e) => handleItemChange(index, "quotation_sub_rate", e.target.value)}
                      className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
                    />
                  </div>

                  {/* Design No */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Design No
                    </label>
                    <Input
                      placeholder="Design #"
                      value={item.quotation_sub_design_no}
                      onChange={(e) => handleItemChange(index, "quotation_sub_design_no", e.target.value)}
                      className="border-border hover:border-border-hover focus:border-primary/80 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-text bg-background"
                    />
                  </div>

                  {/* Row actions */}
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

        {/* Form controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link to="/quotes">
            <Button type="button" variant="outline" className="px-6 rounded-xl cursor-pointer">
              Back to List
            </Button>
          </Link>
          <Button
            type="submit"
            className="px-6 rounded-xl cursor-pointer"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating Proposal..." : "Update Quotation"}
          </Button>
        </div>
      </form>

      {/* Select Product Dialog */}
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
