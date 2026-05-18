"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function QuotePrintPage({ quoteId }: { quoteId: string }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-5xl mx-auto mb-20 md:mb-0">
      <div className="flex items-center justify-between print:hidden">
        <PageHeader title={`Print Quote #${quoteId}`} subtitle="Review and print the quotation." />
        <Button onClick={handlePrint}>
          <Printer data-icon="inline-start" className="size-4" />
          Print
        </Button>
      </div>
      
      <Card className="print:border-0 print:shadow-none print:m-0 print:p-0">
        <CardContent className="p-12 print:p-0 text-center text-text-muted">
          <p>Print layout for quote #{quoteId} will be rendered here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
