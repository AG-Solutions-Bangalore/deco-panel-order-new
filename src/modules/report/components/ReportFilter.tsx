import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";

export function ReportFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trigger } = useWebHaptics();

  const tabs = [
    { label: "Product Report", path: "/product-report" },
    { label: "Order Report", path: "/order-report" },
    { label: "Quotation Report", path: "/quotation-report" },
  ];

  return (
    <div className="flex w-full gap-1 sm:gap-2 mb-6 overflow-x-auto scrollbar-none border-b border-border/80 print:hidden">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => {
              trigger("light");
              navigate(tab.path);
            }}
            className={cn(
              "shrink-0 px-2.5 sm:px-4 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text hover:border-border/60"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
