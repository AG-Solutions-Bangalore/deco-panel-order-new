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
} from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";
import { useSidebarStore } from "@/lib/store/use-sidebar-store";
import { AppLogo } from "@/components/brand/app-logo";

const menuItems = [
  { name: "Orders", href: "/", icon: Home },
  { name: "Create Order", href: "/orders/create", icon: PlusCircle },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Users", href: "/users", icon: Users },
  { name: "Reports", href: "/product-report", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
];

export function DesktopSidebar() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { pathname } = useLocation();
  const { trigger } = useWebHaptics();
  const { resolvedTheme, setTheme } = useTheme();

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
          to="/"
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
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

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

      {/* Footer Area with Theme Toggle and Logout */}
      <div className="p-3 border-t border-border flex flex-col gap-2">
        <button
          onClick={() => {
            trigger("light");
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
          }}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-3 text-text-muted hover:bg-muted hover:text-text transition-all duration-300 w-full text-left",
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

        <Link
          to="/login"
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-3 text-destructive hover:bg-destructive/10 transition-all duration-300",
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
