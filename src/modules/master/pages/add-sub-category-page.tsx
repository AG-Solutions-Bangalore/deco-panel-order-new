import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useActiveCategories, useCreateSubCategoryMutation } from "../hooks/use-master";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddSubCategoryPage() {
  const { trigger } = useWebHaptics();
  const { data: categories = [], isLoading: isLoadingCategories } = useActiveCategories();
  const createMutation = useCreateSubCategoryMutation();

  const [categoryId, setCategoryId] = useState("");
  const [subName, setSubName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !subName || !selectedFile) return;
    trigger("heavy");

    const formData = new FormData();
    formData.append("product_category_id", categoryId);
    formData.append("product_sub_category", subName);
    formData.append("product_sub_category_image", selectedFile);

    createMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center gap-3 bg-panel border border-border/80 p-4 rounded-2xl shadow-xs">
        <Button asChild variant="outline" size="icon" className="rounded-full h-9 w-9 cursor-pointer">
          <Link to="/sub-categories" onClick={() => trigger("light")}>
            <ArrowLeft className="size-5 text-text-muted" />
          </Link>
        </Button>
        <h2 className="text-text text-lg font-extrabold tracking-tight">Create Sub Category</h2>
      </div>

      <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl pt-0">
        <CardContent className="p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-text-muted uppercase tracking-wider">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoadingCategories}>
                <SelectTrigger className="w-full bg-background border-border rounded-xl h-10">
                  <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select Parent Category"} />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)} className="text-xs font-semibold rounded-lg cursor-pointer">
                      {cat.product_category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="sub-image" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Sub Category Image *
              </Label>
              <Input
                id="sub-image"
                required
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
                disabled={createMutation.isPending || !categoryId || !subName || !selectedFile}
                className="rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Sub Category"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
