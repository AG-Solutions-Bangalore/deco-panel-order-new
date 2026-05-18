import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function OrderListSkeleton() {
  // We use zinc-200 in light mode and zinc-800 in dark mode to ensure gorgeous, visible contrast on card backgrounds.
  const skeletonClass = "bg-zinc-200/80 dark:bg-zinc-800/80";

  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-panel border-border shadow-sm">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Skeleton className={`h-4 w-20 ${skeletonClass}`} />
                <Skeleton className={`h-4 w-4 rounded-full ${skeletonClass}`} />
              </div>
              <Skeleton className={`h-8 w-16 ${skeletonClass}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Banners Skeleton */}
      <div className="flex flex-col gap-3">
        <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className={`flex-shrink-0 w-32 h-24 rounded-xl ${skeletonClass}`} />
          ))}
        </div>
      </div>

      {/* Pending Orders Section Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className={`h-6 w-36 ${skeletonClass}`} />
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-panel border-border shadow-sm">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Skeleton className={`h-5 w-28 ${skeletonClass}`} />
                  <Skeleton className={`h-4 w-48 ${skeletonClass}`} />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <Skeleton className={`h-6 w-16 rounded-full ${skeletonClass}`} />
                  <Skeleton className={`h-8 w-8 rounded-full hidden sm:block ${skeletonClass}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderListSkeleton;