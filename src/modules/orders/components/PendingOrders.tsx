"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { PendingOrder } from "../types";

interface PendingOrdersProps {
  orders: PendingOrder[];
}

export default function PendingOrders({ orders }: PendingOrdersProps) {
  const { trigger } = useWebHaptics();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text tracking-tight">
          Pending Orders
        </h2>
        <span className="text-xs font-semibold text-text-muted">
          {orders?.length || 0} active
        </span>
      </div>

      {orders && orders.length > 0 ? (
        <div className="grid gap-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              onClick={() => trigger("light")}
              className="bg-panel shadow-sm border-border hover:border-primary/40 active:scale-[0.99] transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="font-bold text-text tracking-tight text-sm md:text-base line-clamp-1">
                    Order #{order.orders_no}
                  </span>
                  <span className="text-xs md:text-sm text-text-muted line-clamp-1">
                    {order.full_name} &middot; {order.orders_date}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {/* Premium iOS-style Status pill */}
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {order.orders_status}
                  </span>
                  
                  {/* Slick Chevron indicating clickability */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 text-text-muted group-hover:text-primary group-hover:bg-primary/5 rounded-full transition-colors shrink-0"
                  >
                    <ChevronRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-panel border-border shadow-xs">
          <CardContent className="p-12 text-center text-text-muted flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">📦</span>
            <p className="font-medium">No pending orders found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
