import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/brand/app-logo";
import { cn } from "@/lib/utils";

const DISMISSED_KEY = "pwa-install-dismissed";

function isStandaloneMode() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function isAuthRoute(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forget-password")
  );
}

export function InstallAppPrompt() {
  const { pathname } = useLocation();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || localStorage.getItem(DISMISSED_KEY) === "true") {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleInstalled = () => {
      localStorage.setItem(DISMISSED_KEY, "true");
      setInstallEvent(null);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!installEvent || !isVisible || isAuthRoute(pathname)) {
    return null;
  }

  const installApp = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      localStorage.setItem(DISMISSED_KEY, "true");
    }

    setInstallEvent(null);
    setIsVisible(false);
  };

  const dismissPrompt = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsVisible(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-24 z-40 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-md md:inset-x-auto md:right-5 md:bottom-5 md:w-96",
      )}
      role="region"
      aria-label="Install Deco Panel app"
    >
      <div className="flex items-center gap-3">
        <AppLogo className="size-11 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">Install Deco Panel</p>
          <p className="text-xs font-medium text-muted-foreground">
            Add it to your device for faster app-like access.
          </p>
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={dismissPrompt}
          aria-label="Dismiss install app prompt"
          className="rounded-full"
        >
          <X data-icon="inline-start" />
        </Button>
      </div>

      <Button type="button" onClick={installApp} className="mt-3 w-full rounded-xl">
        <Download data-icon="inline-start" />
        Install App
      </Button>
    </div>
  );
}
