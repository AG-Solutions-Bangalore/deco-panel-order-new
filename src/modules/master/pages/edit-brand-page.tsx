import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useBrandDetail, useUpdateBrandMutation } from "../hooks/use-master";
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

export function EditBrandPage() {
  const { id } = useParams();
  const { trigger } = useWebHaptics();
  const { data: brand, isLoading } = useBrandDetail(id);
  const updateMutation = useUpdateBrandMutation(id);

  const [name, setName] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync data
  useEffect(() => {
    if (brand) {
      setName(brand.brands_name || "");
      setSort(brand.brands_sort !== undefined && brand.brands_sort !== null ? String(brand.brands_sort) : "");
      setStatus(brand.brands_status || "Active");
    }
  }, [brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    trigger("heavy");

    const formData = new FormData();
    formData.append("brand_name", name);
    formData.append("brands_name", name);
    formData.append("brand_status", status);
    formData.append("brands_status", status);
    if (sort) {
      formData.append("brand_sort", sort);
      formData.append("brands_sort", sort);
    }
    if (selectedFile) {
      formData.append("brand_image", selectedFile);
      formData.append("brands_image", selectedFile);
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 animate-fade-in">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-sm font-semibold text-text-muted animate-pulse">Loading brand details...</span>
      </div>
    );
  }

  const imageUrl = brand?.brands_image
    ? `https://decopanel.in/storage/app/public/product_category/${brand.brands_image}`
    : "https://decopanel.in/storage/app/public/no_image.jpg";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center gap-3 bg-panel border border-border/80 p-4 rounded-2xl shadow-xs">
        <Button asChild variant="outline" size="icon" className="rounded-full h-9 w-9 cursor-pointer">
          <Link to="/brand" onClick={() => trigger("light")}>
            <ArrowLeft className="size-5 text-text-muted" />
          </Link>
        </Button>
        <h2 className="text-text text-lg font-extrabold tracking-tight">Edit Brand</h2>
      </div>

      <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl overflow-hidden pt-0">
        <CardContent className="p-5 md:p-6 flex flex-col gap-5">
          {imageUrl && (
            <div className="flex items-center gap-4 p-3 bg-muted/20 border border-border/40 rounded-xl w-fit">
              <img
                src={imageUrl}
                alt={brand?.brands_name || "Brand logo"}
                className="w-20 h-20 object-cover rounded-lg border border-border/60 shadow-xs"
                loading="lazy"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Current Logo</span>
                <span className="text-xs font-semibold text-text/80 truncate max-w-xs">{brand?.brands_image || "no_image.jpg"}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand-name" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Brand Name *
              </Label>
              <Input
                id="brand-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Decopanel Premium"
                className="bg-background border-border rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand-sort" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Sort Order
              </Label>
              <Input
                id="brand-sort"
                type="text"
                pattern="[0-9]*"
                value={sort}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setSort(e.target.value);
                }}
                placeholder="e.g. 1"
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
              <Label htmlFor="brand-image" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Change Image (Optional)
              </Label>
              <Input
                id="brand-image"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="bg-background border-border rounded-xl cursor-pointer py-1.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="rounded-xl font-bold text-xs cursor-pointer">
                <Link to="/brand" onClick={() => trigger("light")}>
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !name}
                className="rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Brand"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
