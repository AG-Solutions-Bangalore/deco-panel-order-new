import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderListSkeleton from "@/modules/orders/components/OrderListSkeleton";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import QuotesTable from "../components/QuotesTable";
import { useCompletedQuotesList, useOpenQuotesList, useProcessingQuotesList } from "../hooks/use-quotes";

export function QuoteListPage() {
  const [activeTab, setActiveTab] = useState<string>("open");

  // Call parallel query layers
  const { data: openQuotes = [], isLoading: isLoadingOpen } = useOpenQuotesList();
  const { data: processingQuotes = [], isLoading: isLoadingProcessing } = useProcessingQuotesList();
  const { data: completedQuotes = [], isLoading: isLoadingCompleted } = useCompletedQuotesList();

  return (
    <div className="flex flex-col gap-1 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <PageHeader title="Quotations" subtitle="Manage your company proposals and quotation lifecycles.">
        <Button asChild className="shrink-0">
          <Link to="/">
            <PlusCircle data-icon="inline-start" className="size-4" />
            Create Quotation
          </Link>
        </Button>
      </PageHeader>
      {/* Unified life-cycle switcher */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4 overflow-x-auto scrollbar-none w-full max-w-full">
          <TabsList className="bg-muted/65 p-1 rounded-xl flex flex-row shrink-0 min-w-max">
            <TabsTrigger value="open" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer whitespace-nowrap">
              Open Proposals ({isLoadingOpen ? "..." : openQuotes.length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer whitespace-nowrap">
              Processing ({isLoadingProcessing ? "..." : processingQuotes.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg px-4 py-2 font-bold text-xs cursor-pointer whitespace-nowrap">
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
