"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useOpenQuotesList, useProcessingQuotesList, useCompletedQuotesList } from "../hooks/use-quotes";
import QuotesTable from "../components/QuotesTable";
import OrderListSkeleton from "@/modules/orders/components/OrderListSkeleton";
import { PlusCircle, FileText, ClipboardList, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function QuoteListPage() {
  const [activeTab, setActiveTab] = useState<string>("open");

  // Call parallel query layers
  const { data: openQuotes = [], isLoading: isLoadingOpen } = useOpenQuotesList();
  const { data: processingQuotes = [], isLoading: isLoadingProcessing } = useProcessingQuotesList();
  const { data: completedQuotes = [], isLoading: isLoadingCompleted } = useCompletedQuotesList();

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <PageHeader title="Quotations" subtitle="Manage your company proposals and quotation lifecycles.">
        <Button asChild className="shrink-0">
          <Link href="/">
            <PlusCircle data-icon="inline-start" className="size-4" />
            Create Quotation
          </Link>
        </Button>
      </PageHeader>

      {/* Premium mini-metrics header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <Card className="bg-panel border border-border/80 shadow-xs relative overflow-hidden py-3">
          <CardContent className="flex items-center gap-4 py-0 px-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15">
              <FileText className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Open Quotes</span>
              <span className="text-xl font-black text-text mt-0.5">{isLoadingOpen ? "..." : openQuotes.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-panel border border-border/80 shadow-xs relative overflow-hidden py-3">
          <CardContent className="flex items-center gap-4 py-0 px-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15">
              <ClipboardList className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Processing</span>
              <span className="text-xl font-black text-text mt-0.5">{isLoadingProcessing ? "..." : processingQuotes.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-panel border border-border/80 shadow-xs relative overflow-hidden py-3">
          <CardContent className="flex items-center gap-4 py-0 px-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
              <ShieldAlert className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Archived Quotes</span>
              <span className="text-xl font-black text-text mt-0.5">{isLoadingCompleted ? "..." : completedQuotes.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unified life-cycle switcher */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
          <TabsList className="bg-muted/65 p-1 rounded-xl">
            <TabsTrigger value="open" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer">
              Open Proposals ({isLoadingOpen ? "..." : openQuotes.length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer">
              Processing ({isLoadingProcessing ? "..." : processingQuotes.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer">
              Completed/Cancel ({isLoadingCompleted ? "..." : completedQuotes.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1 Content: Open proposals */}
        <TabsContent value="open" className="focus-visible:outline-none focus-visible:ring-0">
          {isLoadingOpen ? (
            <OrderListSkeleton />
          ) : (
            <div className="flex flex-col gap-8 animate-fade-in duration-300">
              <QuotesTable quotes={openQuotes} type="open" />
            </div>
          )}
        </TabsContent>

        {/* Tab 2 Content: Processing proposals */}
        <TabsContent value="processing" className="focus-visible:outline-none focus-visible:ring-0">
          {isLoadingProcessing ? (
            <OrderListSkeleton />
          ) : (
            <div className="flex flex-col gap-8 animate-fade-in duration-300">
              <QuotesTable quotes={processingQuotes} type="processing" />
            </div>
          )}
        </TabsContent>

        {/* Tab 3 Content: Completed and cancelled */}
        <TabsContent value="completed" className="focus-visible:outline-none focus-visible:ring-0">
          {isLoadingCompleted ? (
            <OrderListSkeleton />
          ) : (
            <div className="flex flex-col gap-8 animate-fade-in duration-300">
              <QuotesTable quotes={completedQuotes} type="completed" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
