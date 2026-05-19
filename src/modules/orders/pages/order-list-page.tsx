import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useOrderList } from "../hooks/use-order-list";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import OrderListSkeleton from "../components/OrderListSkeleton";
import OrdersTable from "../components/OrdersTable";
import DashboardYearSelect from "../components/DashboardYearSelect";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function OrderListPage() {
  const {
    selectedYear,
    setSelectedYear,
    activeTab,
    setActiveTab,
    dashboardData,
    pendingOrders,
    isLoadingData,
    isLoadingPending,
    availableYears,
  } = useOrderList();

  return (
    <div className="flex gap-5 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      {/* <PageHeader title="Orders" subtitle="Manage your orders and operations">
        <div className="flex items-start md:items-center gap-2.5 w-full sm:w-auto sm:justify-start">

          {activeTab === "recent" && (
            <DashboardYearSelect
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              availableYears={availableYears}
            />
          )}

          <Button asChild className="shrink-0">
            <Link to="/orders/create">
              <PlusCircle data-icon="inline-start" className="size-4" />
              Create Order
            </Link>
          </Button>
        </div>
      </PageHeader> */}

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
              Recent Orders
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg  font-bold text-xs cursor-pointer"
            >
              Pending List
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="recent"
          className="focus-visible:outline-none focus-visible:ring-0"
        >
          {isLoadingData ? (
            <OrderListSkeleton />
          ) : dashboardData ? (
            <div className="flex flex-col gap-8 animate-fade-in duration-300">
              <OrdersTable orders={dashboardData.pendingOrder || []} />
            </div>
          ) : (
            <Card className="bg-panel shadow-sm border-border">
              <CardContent className="p-12 text-center text-text-muted">
                <p>Failed to load dashboard data. Please try again.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent
          value="pending"
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
      </Tabs>
    </div>
  );
}
