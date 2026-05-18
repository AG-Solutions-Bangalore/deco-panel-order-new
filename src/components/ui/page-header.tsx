"use client";

import { ReactNode } from "react";

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export const PageHd = PageHeader;
