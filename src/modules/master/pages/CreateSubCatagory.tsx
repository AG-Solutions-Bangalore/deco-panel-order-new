import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";

interface CreateSubCategoryProps {
  open: boolean;
  onClick: () => void;
  populateCategorySub: (id?: any) => void;
}

export default function CreateSubCaterogy({ open, onClick, populateCategorySub }: CreateSubCategoryProps) {
  const { trigger } = useWebHaptics();
  const [subName, setSubName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryId = localStorage.getItem("products_catg_id");
    if (!categoryId) {
      toast.error("Parent category not found. Please select a category first.");
      return;
    }
    if (!subName || !selectedFile) {
      toast.error("Please enter sub-category name and upload an image.");
      return;
    }
    trigger("heavy");
    setLoading(true);
    const formData = new FormData();
    formData.append("product_category_id", categoryId);
    formData.append("product_sub_category", subName);
    formData.append("product_sub_category_image", selectedFile);

    try {
      const response = await api.post("/web-create-sub-category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.code === 200) {
        toast.success(response.data.msg || "Sub Category created successfully");
        setSubName("");
        setSelectedFile(null);
        populateCategorySub(response.data.id);
      } else {
        toast.error(response.data.msg || "Failed to create sub category");
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
          <DialogTitle className="font-extrabold text-lg text-text">Create Sub Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subcategory-name" className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Sub Category Name *
            </Label>
            <Input
              id="subcategory-name"
              required
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="e.g. 1.0mm Glossy"
              className="bg-background border-border rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subcategory-image" className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Sub Category Image *
            </Label>
            <Input
              id="subcategory-image"
              required
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
