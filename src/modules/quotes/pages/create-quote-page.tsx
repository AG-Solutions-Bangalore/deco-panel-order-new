"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CreateQuotePage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-5xl mx-auto mb-20 md:mb-0">
      <PageHeader title="Create Quote" subtitle="Draft a new quote." />
      
      <Card>
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 text-sm text-text-muted">
            <p>Quote creation form will be implemented here.</p>
            <Button className="w-fit">Save Quote</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
