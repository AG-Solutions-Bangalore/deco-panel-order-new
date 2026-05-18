"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Menu, FileText, User, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useWebHaptics } from "web-haptics/react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function BottomNav() {
  const pathname = usePathname();
  const { trigger } = useWebHaptics();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const isOrdersActive = pathname === "/";

  return (
    <>
      {/* Spacer to prevent page content overlap */}
      <div className="h-20 md:hidden pb-[env(safe-area-inset-bottom)]" />

      {/* Modern, Premium 3-Tab Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-20 rounded-t-3xl items-center justify-around border-t border-border/50 bg-background/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)] md:hidden">
        {/* Left Item: Orders */}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/"
            onClick={handlePress}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 px-6 py-1 transition-all duration-200",
              isOrdersActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className="size-6" strokeWidth={isOrdersActive ? 2.5 : 1.75} />
            <span className="text-[10px] font-semibold tracking-wide">Orders</span>
          </Link>
        </div>

        {/* Center Item: Floating Plus Action Button */}
        <div className="relative flex flex-1 justify-center">
          <button
            onClick={() => {
              trigger("medium");
              setCreateSheetOpen(true);
            }}
            className="absolute -top-7 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 active:scale-90 hover:bg-primary/95"
            aria-label="Create new item"
          >
            <Plus className="size-8" strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Item: Menu Button */}
        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => {
              handlePress();
              setMenuSheetOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-0.5 px-6 py-1 text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-200"
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold tracking-wide">Menu</span>
          </button>
        </div>
      </div>

      {/* 1. Create Options Bottom Sheet */}
      <Sheet open={createSheetOpen} onOpenChange={setCreateSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-6 pb-8 max-w-md mx-auto border-t border-border bg-background">
          <SheetHeader className="pb-4 border-b border-border/50 text-center">
            <SheetTitle className="text-lg font-bold">Create New</SheetTitle>
            <SheetDescription className="sr-only">
              Choose to create a new order or a new quote from this quick access menu.
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link
              href="/orders/create"
              onClick={() => {
                handlePress();
                setCreateSheetOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-border bg-card hover:bg-muted/40 transition-colors group"
            >
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="size-6" />
              </div>
              <span className="font-semibold text-sm">New Order</span>
            </Link>

            <Link
              href="/quotes/create"
              onClick={() => {
                handlePress();
                setCreateSheetOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-border bg-card hover:bg-muted/40 transition-colors group"
            >
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="size-6" />
              </div>
              <span className="font-semibold text-sm">New Quote</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* 2. Hamburger Drawer (Right-Side Menu) */}
      <Sheet open={menuSheetOpen} onOpenChange={setMenuSheetOpen}>
        <SheetContent side="right" className="w-80 p-0 border-l border-border flex flex-col h-full bg-background">
          <SheetHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <SheetTitle className="text-xl font-bold">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Quick links to navigate to quotes list and user profile settings.
              </SheetDescription>
            </div>

            {mounted && (
              <button
                onClick={() => {
                  trigger("light");
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
                className="p-2.5 rounded-full border border-border bg-panel hover:bg-muted text-text-muted hover:text-text active:scale-90 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </button>
            )}
          </SheetHeader>

          <nav className="flex-1 flex flex-col gap-1 p-4">
            <Link
              href="/quotes"
              onClick={() => {
                handlePress();
                setMenuSheetOpen(false);
              }}
              className="flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <FileText className="size-5 text-primary" />
              <span>Quotes List</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => {
                handlePress();
                setMenuSheetOpen(false);
              }}
              className="flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <User className="size-5 text-primary" />
              <span>Profile Settings</span>
            </Link>
          </nav>

          <div className="p-6 border-t border-border/50 text-center text-xs text-muted-foreground">
            Deco Panel v1.0.0
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}