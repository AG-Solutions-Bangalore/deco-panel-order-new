import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, FileText, User } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { pathname } = useLocation();
  const { trigger } = useWebHaptics();

  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forget-password")
  ) {
    return null;
  }

  const handlePress = () => {
    trigger("light");
  };

  const isCreateOrderActive = pathname === "/orders/create";
  const isOrdersActive = pathname === "/";
  const isQuotesActive = pathname?.startsWith("/quotes");
  const isProfileActive = pathname?.startsWith("/profile");

  const tabs = [

    { name: "Orders", href: "/", icon: Home, active: isOrdersActive },
    { name: "Order", href: "/orders/create", icon: PlusCircle, active: isCreateOrderActive },
    { name: "Quotes", href: "/quotes", icon: FileText, active: isQuotesActive },
    { name: "Profile", href: "/profile", icon: User, active: isProfileActive },
  ];

  return (
    <>
      {/* Spacer to prevent page content overlap */}
      <div className="h-20 md:hidden pb-[env(safe-area-inset-bottom)] print:hidden" />

      {/* Modern, Premium 4-Tab Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-20 rounded-t-3xl items-center justify-around border-t border-border/55 bg-background/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)] md:hidden print:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div key={tab.name} className="flex flex-1 items-center justify-center">
              <Link
                to={tab.href}
                onClick={handlePress}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 px-4 py-2 transition-all duration-200",
                  tab.active
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground active:scale-95"
                )}
              >
                <Icon className="size-5.5" strokeWidth={tab.active ? 2.5 : 1.75} />
                <span className="text-[10px] font-bold tracking-wide">{tab.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
