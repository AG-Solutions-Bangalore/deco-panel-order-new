import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductsList, useActiveCategories, useSubCategoriesList, useBrandsList } from "../hooks/use-master";
import MasterFilter from "../components/MasterFilter";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusCircle, Pencil, Search, X, Loader2, ArrowUpDown } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductsListPage() {
  const { trigger } = useWebHaptics();
  const { data: products = [], isLoading } = useProductsList();
  const { data: categories = [] } = useActiveCategories();
  const { data: subcategories = [] } = useSubCategoriesList();
  const { data: brands = [] } = useBrandsList();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [subCategoryFilter, setSubCategoryFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userTypeId, setUserTypeId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"product_category" | "product_sub_category" | "products_brand" | "products_rate" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserTypeId(localStorage.getItem("user_type_id"));
    }
  }, []);

  const handleSort = (field: "product_category" | "product_sub_category" | "products_brand" | "products_rate") => {
    trigger("light");
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredProducts = products
    .filter((prod) => {
      const matchesSearch =
        (prod.product_category || "").toLowerCase().includes(search.toLowerCase()) ||
        (prod.product_sub_category || "").toLowerCase().includes(search.toLowerCase()) ||
        (prod.products_brand || "").toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory =
        categoryFilter === "ALL" || 
        (prod.product_category || "").trim().toLowerCase() === categoryFilter.trim().toLowerCase();
      
      const matchesSubCategory =
        subCategoryFilter === "ALL" || 
        (prod.product_sub_category || "").trim().toLowerCase() === subCategoryFilter.trim().toLowerCase();
      
      const matchesBrand =
        brandFilter === "ALL" || 
        (prod.products_brand || "").trim().toLowerCase() === brandFilter.trim().toLowerCase();
      
      const matchesStatus =
        statusFilter === "ALL" || 
        (prod.product_status && prod.product_status.toLowerCase() === statusFilter.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesSubCategory && matchesBrand && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];

      if (sortField === "products_rate") {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return sortAsc ? numA - numB : numB - numA;
      }

      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

  // Filter sub-category dropdown options based on selected category name
  const dropdownSubCategories = categoryFilter === "ALL"
    ? subcategories
    : subcategories.filter(sub => (sub.product_category || "").trim().toLowerCase() === categoryFilter.trim().toLowerCase());

  const showAddButton = userTypeId !== "1";

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <PageHeader title="Master Data" subtitle="Configure categories, sub-categories, brands, and products.">
        {showAddButton && (
          <Button asChild className="shrink-0 cursor-pointer shadow-sm">
            <Link to="/add-product" onClick={() => trigger("light")}>
              <PlusCircle className="size-4" />
              Add Product
            </Link>
          </Button>
        )}
      </PageHeader>

      <MasterFilter />

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-panel border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs mb-1">
        <div className="relative w-full xl:max-w-xs group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-text-muted group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border hover:border-border-hover focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium outline-none transition-all placeholder:text-text-muted"
          />
          {search && (
            <button
              onClick={() => {
                trigger("light");
                setSearch("");
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text rounded-full p-0.5 hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(val) => { trigger("light"); setCategoryFilter(val); setSubCategoryFilter("ALL"); }}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background border-border rounded-xl h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-[--radix-select-trigger-width] z-50 bg-popover border border-border rounded-xl">
              <SelectItem value="ALL" className="text-xs font-semibold rounded-lg cursor-pointer">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.product_category} className="text-xs font-semibold rounded-lg cursor-pointer">
                  {cat.product_category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sub-category Filter */}
          <Select value={subCategoryFilter} onValueChange={(val) => { trigger("light"); setSubCategoryFilter(val); }}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background border-border rounded-xl h-10">
              <SelectValue placeholder="Sub Category" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-[--radix-select-trigger-width] z-50 bg-popover border border-border rounded-xl">
              <SelectItem value="ALL" className="text-xs font-semibold rounded-lg cursor-pointer">All Sub Categories</SelectItem>
              {dropdownSubCategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.product_sub_category} className="text-xs font-semibold rounded-lg cursor-pointer">
                  {sub.product_sub_category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Brand Filter */}
          <Select value={brandFilter} onValueChange={(val) => { trigger("light"); setBrandFilter(val); }}>
            <SelectTrigger className="w-full sm:w-[160px] bg-background border-border rounded-xl h-10">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-[--radix-select-trigger-width] z-50 bg-popover border border-border rounded-xl">
              <SelectItem value="ALL" className="text-xs font-semibold rounded-lg cursor-pointer">All Brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.brands_name} value={b.brands_name} className="text-xs font-semibold rounded-lg cursor-pointer">
                  {b.brands_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(val) => { trigger("light"); setStatusFilter(val); }}>
            <SelectTrigger className="w-full sm:w-[130px] bg-background border-border rounded-xl h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper" className="w-[--radix-select-trigger-width] z-50 bg-popover border border-border rounded-xl">
              <SelectItem value="ALL" className="text-xs font-semibold rounded-lg cursor-pointer">All Status</SelectItem>
              <SelectItem value="Active" className="text-xs font-semibold rounded-lg cursor-pointer">Active</SelectItem>
              <SelectItem value="Inactive" className="text-xs font-semibold rounded-lg cursor-pointer">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TooltipProvider>
        <Card className="bg-panel py-0 border border-border/80 shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-text-muted animate-pulse">Loading products...</span>
              </div>
            ) : (
              <div className="overflow-x-auto relative scrollbar-thin">
                <Table>
                  <TableHeader className="bg-muted/40 border-b border-border/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-20">Image</TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("product_category")}
                          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
                        >
                          Category
                          <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("product_sub_category")}
                          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
                        >
                          Sub Category
                          <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("products_brand")}
                          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
                        >
                          Brand
                          <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-24">Thickness</TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-24">Size</TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-24">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("products_rate")}
                          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
                        >
                          Rate
                          <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-28">Status</TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted text-right pr-6 w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const imageUrl = product.products_image
                          ? `https://decopanel.in/storage/app/public/allimages/${product.products_image}`
                          : "https://decopanel.in/storage/app/public/no_image.jpg";
                        const isActive = product.product_status === "Active";

                        return (
                          <TableRow key={product.id} className="border-b border-border/40 hover:bg-primary/[0.03] dark:hover:bg-primary/[0.08] transition-all duration-300 ease-in-out">
                            <TableCell className="py-3.5 px-4">
                              <img
                                src={imageUrl}
                                alt="Product"
                                className="size-11 rounded-full object-cover border border-border/50 bg-background shadow-xs shrink-0"
                                loading="lazy"
                              />
                            </TableCell>
                            <TableCell className="py-3.5 px-4 font-semibold text-text text-sm">
                              {product.product_category}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 font-semibold text-text text-sm">
                              {product.product_sub_category}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 font-semibold text-text text-sm">
                              {product.products_brand}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-text font-semibold text-sm">
                              {product.products_thickness} {product.products_unit}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-text font-semibold text-sm whitespace-nowrap">
                              {product.products_size1} x {product.products_size2} {product.products_size_unit}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-text font-bold text-sm font-mono">
                              ₹{Number(product.products_rate).toFixed(2)}
                            </TableCell>
                            <TableCell className="py-3.5 px-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              }`}>
                                {product.product_status}
                              </span>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-right pr-6">
                              <div className="flex items-center justify-end gap-1.5">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      disabled={!showAddButton}
                                      className="h-8 w-8 text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-all cursor-pointer"
                                      asChild={showAddButton}
                                    >
                                      {showAddButton ? (
                                        <Link to={`/edit-product/${product.id}`} onClick={() => trigger("light")}>
                                          <Pencil className="size-4" />
                                        </Link>
                                      ) : (
                                        <Pencil className="size-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-foreground text-background font-semibold text-xs px-2.5 py-1 rounded-lg">
                                    Edit Product
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-48 text-center text-text-muted p-6">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-3xl">📦</span>
                            <p className="font-semibold text-text/80">No products found.</p>
                            <p className="text-xs text-text-muted max-w-xs">
                              Try adjusting your search criteria or add a new product.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
