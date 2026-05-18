"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useOrderList } from "../hooks/use-order-list";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import OrderListSkeleton from "../components/OrderListSkeleton";
import DashboardMetrics from "../components/DashboardMetrics";
import CategoryList from "../components/CategoryList";
import PendingOrders from "../components/PendingOrders";
import DashboardYearSelect from "../components/DashboardYearSelect";

export function OrderListPage() {
  const {
    selectedYear,
    setSelectedYear,
    dashboardData,
    isLoadingData,
    availableYears,
  } = useOrderList();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <PageHeader title="Dashboard" subtitle="Overview of your operations and pending orders." />
        
        <div className="flex items-center gap-3 shrink-0">
          {/* Year selector component in header */}
          <DashboardYearSelect 
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
          />
          
          <Button asChild className="hidden md:flex shrink-0">
            <Link href="/orders/create">
              <PlusCircle data-icon="inline-start" className="size-4" />
              Create Order
            </Link>
          </Button>
        </div>
      </div>

      {isLoadingData ? (
        <OrderListSkeleton />
      ) : dashboardData ? (
        <div className="flex flex-col gap-8">
          {/* Slipped Metrics Grid */}
          <DashboardMetrics 
            productsCount={dashboardData.productsCount}
            ordersCount={dashboardData.ordersCount}
            usersCount={dashboardData.usersCount}
          />

          {/* Slipped Categories Horizontal Snap List */}
          <CategoryList categories={dashboardData.categoryBanner} />

          {/* Slipped Pending Orders Native List */}
          <PendingOrders orders={dashboardData.pendingOrder} />
        </div>
      ) : (
        <Card className="bg-panel shadow-sm border-border">
          <CardContent className="p-12 text-center text-text-muted">
            <p>Failed to load dashboard data. Please try again.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
