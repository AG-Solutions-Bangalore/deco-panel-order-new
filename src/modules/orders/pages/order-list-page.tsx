import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderListSkeleton from "../components/OrderListSkeleton";
import OrdersTable from "../components/OrdersTable";
import { useOrderList } from "../hooks/use-order-list";

export function OrderListPage() {
  const {
    selectedYear,
    setSelectedYear,
    activeTab,
    setActiveTab,
    dashboardData,
    pendingOrders,
    processedOrders,
    isLoadingData,
    isLoadingPending,
    isLoadingProcessed,
    availableYears,
  } = useOrderList();

  return (
    <div className="flex gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
          <TabsList className="bg-muted/65  rounded-xl">
            <TabsTrigger
              value="recent"
              className="rounded-lg  font-bold text-xs cursor-pointer"
            >
              Pending Orders
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg  font-bold text-xs cursor-pointer"
            >
              Processed Orders
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="recent"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          {isLoadingPending ? (
            <OrderListSkeleton />
          ) : pendingOrders ? (
            <div className="flex flex-col gap-8 animate-fade-in duration-300">
              <OrdersTable orders={pendingOrders} />
            </div>
          ) : (
            <Card className="bg-panel shadow-sm border-border">
              <CardContent className="p-12 text-center text-text-muted">
                <p>Failed to load pending orders list. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent
          value="pending"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          {isLoadingProcessed ? (
            <OrderListSkeleton />
          ) : processedOrders ? (
            <div className="flex flex-col gap-8 animate-fade-in duration-300">
              <OrdersTable orders={processedOrders} isProcessed={true} />
            </div>
          ) : (
            <Card className="bg-panel shadow-sm border-border">
              <CardContent className="p-12 text-center text-text-muted">
                <p>Failed to load processed orders list. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
