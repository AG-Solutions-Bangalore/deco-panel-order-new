import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function OrderListSkeleton() {
  // We use zinc-200 in light mode and zinc-800 in dark mode to ensure gorgeous, visible contrast on card backgrounds.
  const skeletonClass = "bg-zinc-200/80 dark:bg-zinc-800/80";

  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Filtering Header Skeleton */}
      <div className="flex flex-col gap-4 bg-panel border border-border/80 rounded-2xl p-4 md:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <Skeleton className={`h-10 w-full md:max-w-md rounded-xl ${skeletonClass}`} />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className={`h-3 w-20 ${skeletonClass}`} />
          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className={`h-7 w-14 rounded-full ${skeletonClass}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Skeleton */}
      <Card className="bg-panel pt-0 border border-border/80 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            {/* Table Header Row Skeleton */}
            <div className="flex items-center justify-between gap-4 py-3.5 px-4 bg-muted/40 border-b border-border/60 min-w-[600px]">
              <div className="flex items-center gap-12 w-full">
                <Skeleton className={`h-4 w-16 ${skeletonClass}`} />
                <Skeleton className={`h-4 w-28 ${skeletonClass}`} />
                <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
                <Skeleton className={`h-4 w-16 ${skeletonClass}`} />
              </div>
              <div className="w-8" />
            </div>

            {/* Table Data Rows Skeleton */}
            <div className="divide-y divide-border/40 min-w-[600px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-4 px-4">
                  <div className="flex items-center gap-12 w-full">
                    {/* Order No */}
                    <Skeleton className={`h-5 w-16 ${skeletonClass}`} />
                    {/* Customer */}
                    <Skeleton className={`h-5 w-28 ${skeletonClass}`} />
                    {/* Date */}
                    <Skeleton className={`h-4.5 w-24 ${skeletonClass}`} />
                    {/* Status Pill */}
                    <Skeleton className={`h-6 w-16 rounded-full ${skeletonClass}`} />
                  </div>
                  {/* Action Chevron */}
                  <Skeleton className={`h-8 w-8 rounded-full ${skeletonClass}`} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderListSkeleton;