import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useActiveCategories, useCategoryDetail, useSubCategoryDetail, useUpdateSubCategoryMutation } from "../hooks/use-master";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function EditSubCategoryPage() {
  const { id } = useParams();
  const { trigger } = useWebHaptics();
  const { data: subcategory, isLoading: isLoadingSubCategory } = useSubCategoryDetail(id);
  const { data: categories = [], isLoading: isLoadingCategories } = useActiveCategories();
  const updateMutation = useUpdateSubCategoryMutation(id);

  const [categoryId, setCategoryId] = useState("");
  const [subName, setSubName] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: categoryDetail } = useCategoryDetail(categoryId);
  const selectedCategoryOption = useMemo(
    () => categories.find((category) => String(category.id) === categoryId),
    [categories, categoryId],
  );
  const selectedCategoryLabel =
    selectedCategoryOption?.product_category ||
    categoryDetail?.product_category ||
    subcategory?.product_category ||
    (categoryId ? `Category #${categoryId}` : "");

  // Sync data
  useEffect(() => {
    if (subcategory) {
      setCategoryId(subcategory.product_category_id !== undefined && subcategory.product_category_id !== null ? String(subcategory.product_category_id) : "");
      setSubName(subcategory.product_sub_category || "");
      setStatus(subcategory.product_sub_category_status || "Active");
    }
  }, [subcategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !subName) return;
    trigger("heavy");

    const formData = new FormData();
    formData.append("product_category_id", categoryId);
    formData.append("product_sub_category", subName);
    formData.append("product_sub_category_status", status);
    if (selectedFile) {
      formData.append("product_sub_category_image", selectedFile);
    }

    updateMutation.mutate(formData);
  };

  if (isLoadingSubCategory) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 animate-fade-in">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-sm font-semibold text-text-muted animate-pulse">Loading sub-category details...</span>
      </div>
    );
  }

  const imageUrl = subcategory?.product_sub_category_image
    ? `https://decopanel.in/storage/app/public/product_category/${subcategory.product_sub_category_image}`
    : "https://decopanel.in/storage/app/public/no_image.jpg";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center gap-3 bg-panel border border-border/80 p-4 rounded-2xl shadow-xs">
        <Button asChild variant="outline" size="icon" className="rounded-full h-9 w-9 cursor-pointer">
          <Link to="/sub-categories" onClick={() => trigger("light")}>
            <ArrowLeft className="size-5 text-text-muted" />
          </Link>
        </Button>
        <h2 className="text-text text-lg font-extrabold tracking-tight">Edit Sub Category</h2>
      </div>

      <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl overflow-hidden pt-0">
        <CardContent className="p-5 md:p-6 flex flex-col gap-5">
          {imageUrl && (
            <div className="flex items-center gap-4 p-3 bg-muted/20 border border-border/40 rounded-xl w-fit">
              <img
                src={imageUrl}
                alt={subcategory?.product_sub_category || "Sub-category image"}
                className="w-20 h-20 object-cover rounded-lg border border-border/60 shadow-xs"
                loading="lazy"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Image</span>
                <span className="text-xs font-semibold text-text/80 truncate max-w-xs">{subcategory?.product_sub_category_image || "no_image.jpg"}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-text-muted uppercase tracking-wider">Category *</Label>
              <NativeSelect
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={isLoadingCategories}
                className="w-full"
              >
                <NativeSelectOption value="" disabled>
                  {isLoadingCategories ? "Loading categories..." : "Select Parent Category"}
                </NativeSelectOption>
                {categoryId && !selectedCategoryOption && (
                  <NativeSelectOption value={categoryId}>{selectedCategoryLabel}</NativeSelectOption>
                )}
                {categories.map((cat) => (
                  <NativeSelectOption key={cat.id} value={String(cat.id)}>
                    {cat.product_category}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sub-name" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Sub Category Name *
              </Label>
              <Input
                id="sub-name"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. 1.5mm Texture"
                className="bg-background border-border rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-text-muted uppercase tracking-wider">Status</Label>
              <NativeSelect value={status} onChange={(event) => setStatus(event.target.value)} className="w-full">
                <NativeSelectOption value="" disabled>
                  Select Status
                </NativeSelectOption>
                {statusOptions.map((opt) => (
                  <NativeSelectOption key={opt.value} value={opt.value}>
                    {opt.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sub-image" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Change Image (Optional)
              </Label>
              <Input
                id="sub-image"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="bg-background border-border rounded-xl cursor-pointer py-1.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="rounded-xl font-bold text-xs cursor-pointer">
                <Link to="/sub-categories" onClick={() => trigger("light")}>
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !categoryId || !subName}
                className="rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Sub Category"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
