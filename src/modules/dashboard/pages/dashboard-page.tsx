import { Package, Users, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardYearSelect } from "@/modules/orders/components/DashboardYearSelect";
import { useDashboard } from "../hooks/use-dashboard";
import KPICard from "../components/kpi-card";
import QuickNavigation from "../components/quick-navigation";
import RecentOrdersCard from "../components/recent-orders-card";
import CategoryShowcase from "../components/category-showcase";

export function DashboardPage() {
  const {
    // States
    selectedYear,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    carouselIndex,
    setCarouselIndex,
    showTable,
    setShowTable,
    closeCategory,
    setCloseCategory,
    fullClose,
    setFullClose,
    fullCloseCategory,
    setFullCloseCategory,

    // Query data
    availableYears,
    dashboardData,
    filteredOrders,

    // Status
    isLoadingData,
    isFetchingData,
    error,

    // Handlers
    handleReloadData,
    handleNextSlide,
    handlePrevSlide,
    triggerHaptic,
  } = useDashboard();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto pb-24 md:pb-6 animate-fade-in duration-300">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-panel border border-border p-5 rounded-2xl shadow-sm gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-text text-2xl md:text-3xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <span className="bg-primary-soft text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider select-none font-mono">
              Live
            </span>
          </div>
          <p className="text-text-muted text-xs md:text-sm font-medium">
            Overview of store catalog status, client accounts, and active
            operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DashboardYearSelect
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleReloadData}
            disabled={isLoadingData || isFetchingData}
            className="rounded-xl h-10 w-10 border-border bg-panel text-text hover:bg-muted shrink-0 cursor-pointer active:scale-95 transition-all"
            title="Refresh metrics"
          >
            <RefreshCw
              className={`size-4 ${isFetchingData ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Products KPI */}
        <KPICard
          title="Total Products"
          value={dashboardData?.productsCount || 0}
          icon={Package}
          colorClass="text-primary"
          bgIconClass="bg-primary/10"
          isLoading={isLoadingData}
        />

        {/* Clients KPI */}
        <KPICard
          title="Active Clients"
          value={dashboardData?.usersCount || 0}
          icon={Users}
          colorClass="text-info"
          bgIconClass="bg-info/10"
          isLoading={isLoadingData}
        />

        {/* Orders KPI */}
        <KPICard
          title="Total Orders"
          value={dashboardData?.ordersCount || 0}
          icon={FileSpreadsheet}
          colorClass="text-success"
          bgIconClass="bg-success/10"
          isLoading={isLoadingData}
        />
      </div>

      {/* Main Operations Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Recent Orders Table */}
        {fullClose && (
          <RecentOrdersCard
            orders={filteredOrders}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoadingData}
            isFetching={isFetchingData}
            error={error}
            showTable={showTable}
            setShowTable={setShowTable}
            setFullClose={setFullClose}
            onReload={handleReloadData}
            onActionClick={() => triggerHaptic("light")}
          />
        )}

        {/* Right Side Stack */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Quick Actions Navigation Matrix */}

          {/* Categories Showcase Carousel */}
          {fullCloseCategory && (
            <CategoryShowcase
              categories={dashboardData?.categoryBanner || []}
              carouselIndex={carouselIndex}
              setCarouselIndex={setCarouselIndex}
              isLoading={isLoadingData}
              isFetching={isFetchingData}
              error={error}
              closeCategory={closeCategory}
              setCloseCategory={setCloseCategory}
              setFullCloseCategory={setFullCloseCategory}
              onReload={handleReloadData}
              onPrev={handlePrevSlide}
              onNext={handleNextSlide}
              onActionClick={() => triggerHaptic("light")}
            />
          )}
          <QuickNavigation onLinkClick={() => triggerHaptic("light")} />
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
