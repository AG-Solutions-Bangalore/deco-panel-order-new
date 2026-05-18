"use client";

import { useWebHaptics } from "web-haptics/react";
import { CategoryBanner } from "../types";

interface CategoryListProps {
  categories: CategoryBanner[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const { trigger } = useWebHaptics();

  if (!categories || categories.length === 0) return null;

  // Curated list of premium colors to assign uniquely based on index
  const colors = [
    { bg: "bg-blue-500/10 text-blue-500", labelBg: "bg-blue-500" },
    { bg: "bg-emerald-500/10 text-emerald-500", labelBg: "bg-emerald-500" },
    { bg: "bg-indigo-500/10 text-indigo-500", labelBg: "bg-indigo-500" },
    { bg: "bg-amber-500/10 text-amber-500", labelBg: "bg-amber-500" },
    { bg: "bg-rose-500/10 text-rose-500", labelBg: "bg-rose-500" },
    { bg: "bg-purple-500/10 text-purple-500", labelBg: "bg-purple-500" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-muted tracking-widest uppercase">
          Categories
        </h2>
        <span className="text-xs font-semibold text-primary/80">
          Swipe to view &rarr;
        </span>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-4 snap-x snap-mandatory scrollbar-none scroll-smooth">
        {categories.map((banner, index) => {
          const colorPair = colors[index % colors.length];
          const firstLetter = banner.product_category.charAt(0).toUpperCase();

          return (
            <div
              key={index}
              onClick={() => trigger("light")}
              className="flex-shrink-0 w-36 h-28 bg-panel border border-border/80 rounded-2xl flex flex-col items-center justify-between p-4 snap-start relative group cursor-pointer shadow-sm hover:border-primary/40 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              {/* Native-feeling icon badge */}
              <div className={`size-10 rounded-full flex items-center justify-center font-bold text-base ${colorPair.bg} shadow-xs`}>
                {firstLetter}
              </div>

              {/* Decorative line pill that expands on hover */}
              <div className={`h-1 w-8 rounded-full ${colorPair.labelBg} opacity-60 group-hover:w-16 transition-all duration-300`} />

              <span className="font-bold text-center text-xs tracking-tight text-text line-clamp-1 mt-2 z-10 group-hover:text-primary transition-colors">
                {banner.product_category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
