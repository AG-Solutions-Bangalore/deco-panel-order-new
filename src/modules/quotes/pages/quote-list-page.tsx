"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function QuoteListPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <PageHeader title="Quotes" subtitle="Manage your client quotations." />
        <Button asChild className="hidden md:flex">
          <Link href="/quotes/create">
            <PlusCircle data-icon="inline-start" className="size-4" />
            Create Quote
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center text-text-muted">
          <div className="flex flex-col items-center justify-center gap-2">
            <p>No quotes found.</p>
            <Button variant="outline" asChild className="mt-4 md:hidden">
              <Link href="/quotes/create">
                <PlusCircle data-icon="inline-start" className="size-4" />
                Create First Quote
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
