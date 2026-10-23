import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";

import { useUserRole } from "@/hooks/use-user-role";

export function ReportFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trigger } = useWebHaptics();
  const { isUser4 } = useUserRole();

  const allTabs = [
    { label: "Product Report", path: "/product-report", allowed: !isUser4 },
    { label: "Order Report", path: "/order-report", allowed: true },
    { label: "Quotation Report", path: "/quotation-report", allowed: true },
  ];

  const tabs = allTabs.filter((tab) => tab.allowed);

  return (
    <div className="flex border-b border-border/80 w-full mb-6 gap-2 print:hidden">
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
              "px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer pb-2",
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
