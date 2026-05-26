import { useState } from "react";
import { Link } from "react-router-dom";
import { useBrandsList } from "../hooks/use-master";
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

export function BrandListPage() {
  const { trigger } = useWebHaptics();
  const { data: brands = [], isLoading } = useBrandsList();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<"brands_name" | "brands_sort" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: "brands_name" | "brands_sort") => {
    trigger("light");
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredBrands = brands
    .filter((brand) => {
      const matchesSearch = (brand.brands_name || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || 
        (brand.brands_status && brand.brands_status.toLowerCase() === statusFilter.toLowerCase());
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];

      if (sortField === "brands_sort") {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return sortAsc ? numA - numB : numB - numA;
      }

      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <PageHeader title="Master Data" subtitle="Configure categories, sub-categories, brands, and products.">
        <Button asChild className="shrink-0 cursor-pointer shadow-sm">
          <Link to="/add-brand" onClick={() => trigger("light")}>
            <PlusCircle className="size-4" />
            Add Brand
          </Link>
        </Button>
      </PageHeader>

      <MasterFilter />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-panel border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs mb-1">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-text-muted group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search brands..."
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

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={(val) => { trigger("light"); setStatusFilter(val); }}>
            <SelectTrigger className="w-full md:w-[150px] bg-background border-border rounded-xl h-10">
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
                <span className="text-sm font-semibold text-text-muted animate-pulse">Loading brands...</span>
              </div>
            ) : (
              <div className="overflow-x-auto relative scrollbar-thin">
                <Table>
                  <TableHeader className="bg-muted/40 border-b border-border/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-20">Logo</TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("brands_name")}
                          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
                        >
                          Brand Name
                          <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-32">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("brands_sort")}
                          className="-ml-4 hover:bg-primary/5 hover:text-primary font-bold text-xs uppercase tracking-wider text-text-muted transition-colors duration-200"
                        >
                          Sort Order
                          <ArrowUpDown className="ml-1.5 size-3.5 shrink-0" />
                        </Button>
                      </TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted w-32">Status</TableHead>
                      <TableHead className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-text-muted text-right pr-6 w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => {
                        const brandId = brand.id;
                        const hasBrandId = brandId !== undefined && brandId !== null && String(brandId) !== "";
                        const imageUrl = brand.brands_image
                          ? `https://decopanel.in/storage/app/public/product_category/${brand.brands_image}`
                          : "https://decopanel.in/storage/app/public/no_image.jpg";
                        const isActive = brand.brands_status === "Active";

                        return (
                          <TableRow key={hasBrandId ? String(brandId) : brand.brands_name} className="border-b border-border/40 hover:bg-primary/[0.03] dark:hover:bg-primary/[0.08] transition-all duration-300 ease-in-out">
                            <TableCell className="py-3.5 px-4">
                              <img
                                src={imageUrl}
                                alt={brand.brands_name}
                                className="size-11 rounded-full object-cover border border-border/50 bg-background shadow-xs shrink-0"
                                loading="lazy"
                              />
                            </TableCell>
                            <TableCell className="py-3.5 px-4 font-semibold text-text text-sm">
                              {brand.brands_name}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-text-muted text-xs font-mono font-bold">
                              {brand.brands_sort || "—"}
                            </TableCell>
                            <TableCell className="py-3.5 px-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                isActive
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              }`}>
                                {brand.brands_status}
                              </span>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-right pr-6">
                              <div className="flex items-center justify-end gap-1.5">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {hasBrandId ? (
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="h-8 w-8 text-text-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-all cursor-pointer"
                                        asChild
                                      >
                                        <Link to={`/edit-brand/${brandId}`} onClick={() => trigger("light")}>
                                          <Pencil className="size-4" />
                                        </Link>
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        disabled
                                        className="h-8 w-8 rounded-xl"
                                      >
                                        <Pencil className="size-4" />
                                      </Button>
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-foreground text-background font-semibold text-xs px-2.5 py-1 rounded-lg">
                                    {hasBrandId ? "Edit Brand" : "Brand id missing"}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center text-text-muted p-6">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-3xl">🏷️</span>
                            <p className="font-semibold text-text/80">No brands found.</p>
                            <p className="text-xs text-text-muted max-w-xs">
                              Try searching for a different term or add a new brand.
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
