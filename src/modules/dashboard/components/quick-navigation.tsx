import { Link } from "react-router-dom";
import { PlusCircle, FileText, ClipboardList, Package, BarChart3, Mail } from "lucide-react";

interface QuickNavigationProps {
  onLinkClick: () => void;
}

export function QuickNavigation({ onLinkClick }: QuickNavigationProps) {
  const links = [
    {
      to: "/orders/create",
      title: "New Order",
      subtitle: "Place Order",
      icon: PlusCircle,
    },
    {
      to: "/quotes/create",
      title: "New Quote",
      subtitle: "Est. Quote",
      icon: FileText,
    },
    {
      to: "/",
      title: "Orders List",
      subtitle: "All Orders",
      icon: ClipboardList,
    },
    {
      to: "/products",
      title: "Master",
      subtitle: "Catalog list",
      icon: Package,
    },
    {
      to: "/product-report",
      title: "Reports",
      subtitle: "Analytics feed",
      icon: BarChart3,
    },
    {
      to: "/form",
      title: "Contact Form",
      subtitle: "Feedback",
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-col gap-3 bg-panel border border-border p-5 rounded-2xl shadow-sm">
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-text-muted px-1 flex items-center justify-between">
        <span>Quick Navigation</span>
        <ClipboardList className="size-3.5 text-primary" />
      </h2>
      <div className="grid grid-cols-2 gap-3 mt-1">
        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <Link
              key={idx}
              to={link.to}
              onClick={onLinkClick}
              className="flex flex-col items-start p-4 bg-background border border-border/60 hover:border-primary/50 hover:bg-primary/[0.01] rounded-xl transition-all duration-200 group cursor-pointer active:scale-95"
            >
              <Icon className="size-5 text-primary group-hover:scale-105 transition-transform mb-1.5" />
              <span className="text-xs font-extrabold text-text">{link.title}</span>
              <span className="text-[9px] font-bold text-text-soft uppercase tracking-tight mt-0.5">{link.subtitle}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default QuickNavigation;
