import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

function OrderListSkeleton() {
  // We use zinc-200/80 in light mode and zinc-800/80 in dark mode to ensure gorgeous, visible contrast on card backgrounds.
  const skeletonClass = "bg-zinc-200/80 dark:bg-zinc-800/80";

  // Simulate different text lengths for a natural loading appearance
  const rowsConfig = [
    { nameWidth: "w-36", dateWidth: "w-24", badgeWidth: "w-16", actionsCount: 2 },
    { nameWidth: "w-28", dateWidth: "w-20", badgeWidth: "w-20", actionsCount: 3 },
    { nameWidth: "w-44", dateWidth: "w-28", badgeWidth: "w-14", actionsCount: 2 },
    { nameWidth: "w-32", dateWidth: "w-22", badgeWidth: "w-16", actionsCount: 2 },
    { nameWidth: "w-40", dateWidth: "w-24", badgeWidth: "w-24", actionsCount: 3 },
  ];

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in">
      {/* Main Table Card Skeleton */}
      <Card className="bg-panel py-0 border border-border/80 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto relative scrollbar-none">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/60">
                <TableRow className="hover:bg-transparent border-b border-border/60">
                  <TableHead className="py-3.5 px-4 font-bold align-middle w-[15%]">
                    <Skeleton className={`h-4 w-16 ${skeletonClass}`} />
                  </TableHead>
                  <TableHead className="py-3.5 px-4 font-bold align-middle w-[35%]">
                    <Skeleton className={`h-4 w-24 ${skeletonClass}`} />
                  </TableHead>
                  <TableHead className="py-3.5 px-4 font-bold align-middle w-[25%]">
                    <Skeleton className={`h-4 w-28 ${skeletonClass}`} />
                  </TableHead>
                  <TableHead className="py-3.5 px-4 font-bold align-middle w-[15%]">
                    <Skeleton className={`h-4 w-16 ${skeletonClass}`} />
                  </TableHead>
                  <TableHead className="py-3.5 px-4 font-bold align-middle w-[10%] text-right pr-4">
                    <div className="flex justify-end pr-4">
                      <Skeleton className={`h-4 w-14 ${skeletonClass}`} />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsConfig.map((row, i) => (
                  <TableRow
                    key={i}
                    className="border-b border-border/40 hover:bg-transparent transition-colors"
                  >
                    {/* Order / Quote No */}
                    <TableCell className="py-4 px-4 align-middle">
                      <Skeleton className={`h-5 w-14 rounded-lg ${skeletonClass}`} />
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="py-4 px-4 align-middle">
                      <Skeleton className={`h-5 ${row.nameWidth} rounded-lg ${skeletonClass}`} />
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-4 px-4 align-middle">
                      <Skeleton className={`h-4.5 ${row.dateWidth} rounded-lg ${skeletonClass}`} />
                    </TableCell>

                    {/* Status Pill */}
                    <TableCell className="py-4 px-4 align-middle">
                      <Skeleton className={`h-6 ${row.badgeWidth} rounded-full ${skeletonClass}`} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 px-4 align-middle">
                      <div className="flex items-center justify-end gap-1.5 pr-2">
                        {Array.from({ length: row.actionsCount }).map((_, btnIdx) => (
                          <Skeleton
                            key={btnIdx}
                            className={`h-8 w-8 rounded-xl ${skeletonClass}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderListSkeleton;