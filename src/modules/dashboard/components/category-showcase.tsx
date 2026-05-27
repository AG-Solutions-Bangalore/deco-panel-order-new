import { ChevronLeft, ChevronRight, Minus, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CategoryBanner } from "../types";

interface CategoryShowcaseProps {
  categories: CategoryBanner[];
  carouselIndex: number;
  setCarouselIndex: (idx: number) => void;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  closeCategory: boolean;
  setCloseCategory: (close: boolean) => void;
  setFullCloseCategory: (close: boolean) => void;
  onReload: () => void;
  onPrev: () => void;
  onNext: () => void;
  onActionClick: () => void;
}

export function CategoryShowcase({
  categories,
  carouselIndex,
  setCarouselIndex,
  isLoading,
  isFetching,
  error,
  closeCategory,
  setCloseCategory,
  setFullCloseCategory,
  onReload,
  onPrev,
  onNext,
  onActionClick,
}: CategoryShowcaseProps) {
  return (
    <Card className="bg-panel border border-border shadow-sm rounded-2xl overflow-hidden flex flex-col transition-all duration-300">
      <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-extrabold text-text">
            Product Categories
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-text-muted">
            Explore available product catalogs.
          </CardDescription>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 text-text-muted">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onActionClick();
              setCloseCategory(!closeCategory);
            }}
            className="size-8 rounded-lg hover:bg-muted cursor-pointer"
            title={closeCategory ? "Collapse panel" : "Expand panel"}
          >
            <Minus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onReload}
            className="size-8 rounded-lg hover:bg-muted cursor-pointer"
            disabled={isLoading || isFetching}
            title="Reload"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onActionClick();
              setFullCloseCategory(false);
            }}
            className="size-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Dismiss card"
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      {closeCategory && (
        <CardContent className="p-5 flex flex-col gap-4">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2">
              <Spinner className="size-6 text-primary" />
              <span className="text-xs text-text-muted font-bold">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center text-xs font-bold text-destructive">
              Failed to load categories.
            </div>
          ) : categories.length > 0 ? (
            <div className="relative w-full flex flex-col gap-4">
              
              {/* Carousel View Shelf */}
              <div className="relative w-full h-[260px] bg-background border border-border/60 rounded-xl overflow-hidden flex items-center justify-center group/slider">
                {categories.map((product, index) => {
                  const isCurrent = index === carouselIndex;
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ease-in-out ${
                        isCurrent 
                          ? "opacity-100 translate-x-0 scale-100 pointer-events-auto" 
                          : "opacity-0 translate-x-6 scale-95 pointer-events-none"
                      }`}
                    >
                      <img
                        src={`https://decopanel.in/storage/app/public/product_category/${product.product_category_image}`}
                        alt={product.product_category}
                        className="h-[150px] max-w-full object-contain rounded-lg drop-shadow-sm select-none"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = "https://decopanel.in/storage/app/public/no_image.jpg";
                        }}
                      />
                      
                      <h3 className="mt-4 text-center font-extrabold text-sm text-text bg-panel/85 border border-border/40 px-4 py-1.5 rounded-full shadow-sm">
                        {product.product_category}
                      </h3>
                    </div>
                  );
                })}

                {/* Slider Navigation Buttons */}
                <button
                  onClick={onPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border/80 bg-panel/85 text-text-muted hover:text-text shadow-sm opacity-0 group-hover/slider:opacity-100 transition-all duration-200 cursor-pointer active:scale-90"
                  aria-label="Previous category"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <button
                  onClick={onNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full border border-border/80 bg-panel/85 text-text-muted hover:text-text shadow-sm opacity-0 group-hover/slider:opacity-100 transition-all duration-200 cursor-pointer active:scale-90"
                  aria-label="Next category"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Pagination Indicators */}
              <div className="flex items-center justify-center gap-1.5">
                {categories.map((_, index) => {
                  const isCurrent = index === carouselIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onActionClick();
                        setCarouselIndex(index);
                      }}
                      className={`size-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isCurrent 
                          ? "bg-primary w-4.5" 
                          : "bg-border-strong hover:bg-text-muted"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs font-bold text-text-muted">
              No categories found.
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
export default CategoryShowcase;
