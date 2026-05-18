"use client";

import Image from "next/image";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-bg">
      {/* Left Pane - Branding & Testimonial (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-zinc-950 p-10 text-white dark:bg-zinc-950/50 dark:border-r border-border">
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-3 font-semibold text-xl tracking-tight">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-bold leading-none">D</span>
          </div>
          Deco Panel
        </div>

        {/* Testimonial / Value Prop Area */}
        <div className="mt-auto max-w-lg">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed text-zinc-100">
              &ldquo;This platform has completely transformed how we manage our orders and operations. The efficiency gains are truly remarkable.&rdquo;
            </p>
            <footer className="text-sm font-medium text-zinc-400">
              Sofia Davis, Operations Director
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Pane - Form Area */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
