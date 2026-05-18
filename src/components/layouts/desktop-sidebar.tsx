"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Home, FileText, PlusCircle, User, LogOut, Sun, Moon } from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";
import { useSidebarStore } from "@/lib/store/use-sidebar-store";

const menuItems = [

  { name: "Orders", href: "/", icon: Home },
  { name: "Create Order", href: "/orders/create", icon: PlusCircle },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

export function DesktopSidebar() {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const pathname = usePathname();
  const { trigger } = useWebHaptics();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const isSidebarOpen = mounted ? isOpen : true;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full bg-panel border-r border-border transition-all duration-300 ease-in-out shrink-0",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Top Header Area */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        {isSidebarOpen && (
          <span className="font-bold text-xl text-text ml-2 tracking-tight transition-opacity duration-300">
            Deco Panel
          </span>
        )}
        <div className={cn("flex justify-center w-full", isSidebarOpen && "w-auto")}>
          <Hamburger
            toggled={isSidebarOpen}
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
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => trigger("light")}
              className={cn(
                "flex items-center gap-4 rounded-lg px-3 py-3 transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-text-muted hover:bg-muted hover:text-text",
                !isSidebarOpen && "justify-center px-0"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <item.icon className="size-5 shrink-0" />
              {isSidebarOpen && (
                <span className="transition-opacity duration-300">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area with Theme Toggle and Logout */}
      <div className="p-3 border-t border-border flex flex-col gap-2">
        {mounted && (
          <button
            onClick={() => {
              trigger("light");
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            className={cn(
              "flex items-center gap-4 rounded-lg px-3 py-3 text-text-muted hover:bg-muted hover:text-text transition-all duration-300 w-full text-left",
              !isSidebarOpen && "justify-center px-0"
            )}
            title={!isSidebarOpen ? "Toggle Theme" : undefined}
          >
            {theme === "dark" ? (
              <>
                <Sun className="size-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium transition-opacity duration-300">Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="size-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium transition-opacity duration-300">Dark Mode</span>}
              </>
            )}
          </button>
        )}

        <Link
          href="/login"
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-4 rounded-lg px-3 py-3 text-destructive hover:bg-destructive/10 transition-all duration-300",
            !isSidebarOpen && "justify-center px-0"
          )}
          title={!isSidebarOpen ? "Logout" : undefined}
        >
          <LogOut className="size-5 shrink-0" />
          {isSidebarOpen && <span className="font-medium transition-opacity duration-300">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
