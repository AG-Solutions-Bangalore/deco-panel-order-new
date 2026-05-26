import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";

interface CreateBrandProps {
  open: boolean;
  onClick: () => void;
  populateBrand: (id?: any) => void;
}

export default function CreateBrand({ open, onClick, populateBrand }: CreateBrandProps) {
  const { trigger } = useWebHaptics();
  const [brandName, setBrandName] = useState("");
  const [sort, setSort] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) {
      toast.error("Please enter a brand name.");
      return;
    }
    trigger("heavy");
    setLoading(true);
    const formData = new FormData();
    formData.append("brand_name", brandName);
    formData.append("brands_name", brandName);
    if (sort) {
      formData.append("brand_sort", sort);
      formData.append("brands_sort", sort);
    }
    if (selectedFile) {
      formData.append("brand_image", selectedFile);
      formData.append("brands_image", selectedFile);
    }

    try {
      const response = await api.post("/web-create-brand", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.code === 200) {
        toast.success(response.data.msg || "Brand created successfully");
        setBrandName("");
        setSort("");
        setSelectedFile(null);
        populateBrand(response.data.id);
      } else {
        toast.error(response.data.msg || "Failed to create brand");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClick()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-lg text-text">Create Brand</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brand-name" className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Brand Name *
            </Label>
            <Input
              id="brand-name"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
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
            <Label htmlFor="brand-image" className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Brand Logo / Image
            </Label>
            <Input
              id="brand-image"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="bg-background border-border rounded-xl cursor-pointer py-1.5 text-xs"
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                trigger("light");
                onClick();
              }}
              className="rounded-xl font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
