import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/components/providers/theme-provider";
import {
  Home,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Sun,
  Moon,
  Users,
  BarChart3,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";
import { useSidebarStore } from "@/lib/store/use-sidebar-store";
import { AppLogo } from "@/components/brand/app-logo";
import { useUserRole } from "@/hooks/use-user-role";

export function DesktopSidebar() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { pathname } = useLocation();
  const { trigger } = useWebHaptics();
  const { resolvedTheme, setTheme } = useTheme();
  const { isUser4, isUser5 } = useUserRole();

  const menuItems = useMemo(() => {
    if (isUser4) {
      // user_type = 4: dashboard, orders, create orders, quotes, reports (order & quotation report)
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Orders", href: "/", icon: Home },
        { name: "Create Order", href: "/orders/create", icon: PlusCircle },
        { name: "Quotes", href: "/quotes", icon: FileText },
        { name: "Reports", href: "/order-report", icon: BarChart3 },
      ];
    }

    if (isUser5) {
      // user_type = 5: dashboard, master (inside master only product), orders, create order, quotes, reports (all 3)
      return [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Orders", href: "/", icon: Home },
        { name: "Create Order", href: "/orders/create", icon: PlusCircle },
        { name: "Quotes", href: "/quotes", icon: FileText },
        { name: "Master", href: "/products", icon: Package },
        { name: "Reports", href: "/product-report", icon: BarChart3 },
      ];
    }

    // Default for user_type = 2, 3 (and other admins): unchanged
    return [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Orders", href: "/", icon: Home },
      { name: "Create Order", href: "/orders/create", icon: PlusCircle },
      { name: "Quotes", href: "/quotes", icon: FileText },
      { name: "Master", href: "/products", icon: Package },
      { name: "Users", href: "/users", icon: Users },
      { name: "Reports", href: "/product-report", icon: BarChart3 },
    ];
  }, [isUser4, isUser5]);

  // Hide on auth routes
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forget-password")
  ) {
    return null;
  }

  const handleLogout = () => {
    trigger("medium");
    localStorage.removeItem("token");
    localStorage.removeItem("user_type_id");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    window.dispatchEvent(new Event("user_role_changed"));
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full bg-panel border-r border-border transition-all duration-300 ease-in-out shrink-0 print:hidden",
        isOpen ? "w-64" : "w-20",
      )}
    >
      {/* Top Header Area */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        <Link
          to={isUser5 ? "/dashboard" : "/"}
          onClick={() => trigger("light")}
          className={cn(
            "flex min-w-0 items-center gap-3 rounded-lg text-text transition-opacity hover:opacity-90",
            !isOpen && "justify-center",
          )}
          title="Deco Panel"
        >
          <AppLogo className="size-9" />
          {isOpen && (
            <span className="truncate font-bold text-xl tracking-tight transition-opacity duration-300">
              Deco Panel
            </span>
          )}
        </Link>
        <div
          className={cn("flex justify-center", isOpen ? "w-auto" : "w-full")}
        >
          <Hamburger
            toggled={isOpen}
            toggle={toggleSidebar}
            size={20}
            color="currentColor"
            onToggle={() => trigger("light")}
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto mt-2">
        {menuItems.map((item) => {
          let isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

          if (item.href === "/products") {
            const masterRoutes = [
              "/products",
              "/add-product",
              "/edit-product",
              "/categories",
              "/add-categories",
              "/edit-categories",
              "/sub-categories",
              "/add-sub-categories",
              "/edit-sub-categories",
              "/brand",
              "/add-brand",
              "/edit-brand",
            ];
            isActive = masterRoutes.some((route) => pathname?.startsWith(route));
          }

          if (item.name === "Reports") {
            const reportRoutes = [
              "/product-report",
              "/order-report",
              "/quotation-report",
              "/order-view-report",
              "/quotation-view-report",
            ];
            isActive = reportRoutes.some((route) => pathname?.startsWith(route));
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => trigger("light")}
              className={cn(
                "flex items-center gap-4 rounded-sm px-3 py-3 transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-text-muted hover:bg-muted hover:text-text",
                !isOpen && "justify-center px-0",
              )}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className="size-5 shrink-0" />
              {isOpen && (
                <span className="transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Common division for all user_types: Profile, Dark Mode, and Logout */}
      <div className="p-3 border-t border-border flex flex-col gap-1.5">
        {/* Profile */}
        <Link
          to="/profile"
          onClick={() => trigger("light")}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-2.5 transition-all duration-300",
            pathname?.startsWith("/profile")
              ? "bg-primary text-primary-foreground font-medium shadow-sm"
              : "text-text-muted hover:bg-muted hover:text-text",
            !isOpen && "justify-center px-0",
          )}
          title={!isOpen ? "Profile" : undefined}
        >
          <User className="size-5 shrink-0" />
          {isOpen && (
            <span className="font-medium transition-opacity duration-300">
              Profile
            </span>
          )}
        </Link>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => {
            trigger("light");
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
          }}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-2.5 text-text-muted hover:bg-muted hover:text-text transition-all duration-300 w-full text-left cursor-pointer",
            !isOpen && "justify-center px-0",
          )}
          title={!isOpen ? "Toggle Theme" : undefined}
        >
          {resolvedTheme === "dark" ? (
            <>
              <Sun className="size-5 shrink-0" />
              {isOpen && (
                <span className="font-medium transition-opacity duration-300">
                  Light Mode
                </span>
              )}
            </>
          ) : (
            <>
              <Moon className="size-5 shrink-0" />
              {isOpen && (
                <span className="font-medium transition-opacity duration-300">
                  Dark Mode
                </span>
              )}
            </>
          )}
        </button>

        {/* Logout */}
        <Link
          to="/login"
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-2.5 text-destructive hover:bg-destructive/10 transition-all duration-300",
            !isOpen && "justify-center px-0",
          )}
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="size-5 shrink-0" />
          {isOpen && (
            <span className="font-medium transition-opacity duration-300">
              Logout
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
