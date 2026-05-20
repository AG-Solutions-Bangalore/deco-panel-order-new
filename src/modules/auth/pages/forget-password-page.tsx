import { ForgetPasswordForm } from "../components/forget-password-form";
import { AppLogo } from "@/components/brand/app-logo";

export function ForgetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-bg">
      {/* Left Pane - Branding & Testimonial (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 p-10 text-white dark:bg-zinc-950/50 dark:border-r border-border">
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-3 font-semibold text-xl tracking-tight">
          <AppLogo className="size-9 ring-1 ring-white/15" />
          Deco Panel
        </div>

        {/* Testimonial / Value Prop Area */}
        <div className="mt-auto max-w-lg">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed text-zinc-100">
              &ldquo;Secure, robust, and dependable. Ensuring you always have access when you need it.&rdquo;
            </p>
            <footer className="text-sm font-medium text-zinc-400">
              Deco Panel Security Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Pane - Form Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <ForgetPasswordForm />
        </div>
      </div>
    </div>
  );
}
