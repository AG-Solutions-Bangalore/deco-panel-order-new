import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, Users } from "lucide-react";

interface DashboardMetricsProps {
  productsCount: number;
  ordersCount: number;
  usersCount: number;
}

export default function DashboardMetrics({
  productsCount,
  ordersCount,
  usersCount,
}: DashboardMetricsProps) {
  const metrics = [
    {
      title: "Products",
      value: productsCount,
      icon: Package,
      gradient: "from-blue-500/10 to-indigo-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "hover:border-blue-500/30",
    },
    {
      title: "Total Orders",
      value: ordersCount,
      icon: ShoppingCart,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "hover:border-emerald-500/30",
    },
    {
      title: "Users",
      value: usersCount,
      icon: Users,
      gradient: "from-violet-500/10 to-purple-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
      borderColor: "hover:border-violet-500/30",
      colSpan: "col-span-2 md:col-span-1",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <Card
          key={idx}
          className={`bg-panel border-border shadow-sm active:scale-98 transition-all duration-300 py-0 overflow-hidden ${metric.borderColor} ${
            metric.colSpan || ""
          }`}
        >
          <CardContent className="p-4 md:p-5 flex flex-col gap-3 relative">
            {/* Soft decorative background gradient pill */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br ${metric.gradient} blur-xl`} />

            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-semibold tracking-wide uppercase text-text-muted">
                {metric.title}
              </span>
              <div className={`p-2 rounded-xl bg-muted/60 ${metric.iconColor}`}>
                <metric.icon className="size-4 md:size-5" />
              </div>
            </div>
            
            <div className="text-2xl md:text-3xl font-extrabold text-text tracking-tight z-10">
              {metric.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
