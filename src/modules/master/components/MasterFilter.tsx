import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";

export default function MasterFilter() {
  const { pathname } = useLocation();
  const { trigger } = useWebHaptics();

  const tabs = [
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Sub Categories", href: "/sub-categories" },
    { name: "Brands", href: "/brand" },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-muted/65 border border-border/40 rounded-xl w-fit mb-5 max-w-full overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            to={tab.href}
            onClick={() => trigger("light")}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0",
              isActive
                ? "bg-panel text-text shadow-sm border border-border/50 scale-[1.02]"
                : "text-text-muted hover:text-text hover:bg-panel/20"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
