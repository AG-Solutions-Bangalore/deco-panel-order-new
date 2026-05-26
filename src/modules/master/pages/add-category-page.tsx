import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCreateCategoryMutation } from "../hooks/use-master";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";

export function AddCategoryPage() {
  const { trigger } = useWebHaptics();
  const createMutation = useCreateCategoryMutation();
  const [name, setName] = useState("");
  const [sort, setSort] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sort || !selectedFile) return;
    trigger("heavy");

    const formData = new FormData();
    formData.append("product_category", name);
    formData.append("product_sort", sort);
    formData.append("product_category_image", selectedFile);

    createMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center gap-3 bg-panel border border-border/80 p-4 rounded-2xl shadow-xs">
        <Button asChild variant="outline" size="icon" className="rounded-full h-9 w-9 cursor-pointer">
          <Link to="/categories" onClick={() => trigger("light")}>
            <ArrowLeft className="size-5 text-text-muted" />
          </Link>
        </Button>
        <h2 className="text-text text-lg font-extrabold tracking-tight">Create Category</h2>
      </div>

      <Card className="bg-panel border border-border/80 shadow-sm rounded-2xl pt-0">
        <CardContent className="p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category-name" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Category Name *
              </Label>
              <Input
                id="category-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acrylic Panels"
                className="bg-background border-border rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category-sort" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Sort Order *
              </Label>
              <Input
                id="category-sort"
                required
                type="text"
                pattern="[0-9]*"
                value={sort}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setSort(e.target.value);
                }}
                placeholder="e.g. 1 (use integer digit)"
                className="bg-background border-border rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category-image" className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Category Image *
              </Label>
              <Input
                id="category-image"
                required
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="bg-background border-border rounded-xl cursor-pointer py-1.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button asChild variant="outline" className="rounded-xl font-bold text-xs cursor-pointer">
                <Link to="/categories" onClick={() => trigger("light")}>
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !name || !sort || !selectedFile}
                className="rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
