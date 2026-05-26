import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full border-b border-border/40 md:border-none pb-4 mab-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm font-medium text-text-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  );
}

export const PageHd = PageHeader;
