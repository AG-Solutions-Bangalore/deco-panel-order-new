import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <img
      src="/originalIcon.jpeg"
      alt="Deco Panel"
      className={cn("size-8 shrink-0 rounded-lg object-cover", className)}
    />
  );
}
