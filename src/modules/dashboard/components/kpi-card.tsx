import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Lightweight count-up animation component
function AnimatedCount({ end, duration = 800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    
    setCount(0);
    if (!end) return;

    let animationFrameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - startValue) + startValue));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return <span className="font-mono">{count}</span>;
}

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  bgIconClass: string;
  isLoading?: boolean;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  colorClass,
  bgIconClass,
  isLoading = false,
}: KPICardProps) {
  return (
    <Card className="bg-panel border border-border shadow-sm rounded-2xl overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-5 md:p-6 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</span>
            {isLoading ? (
              <Skeleton className="h-9 w-20 rounded-lg" />
            ) : (
              <span className="text-3xl font-black text-text tracking-tight">
                <AnimatedCount end={value} />
              </span>
            )}
          </div>
          <div className={`size-11 rounded-xl ${bgIconClass} flex items-center justify-center ${colorClass} group-hover:scale-105 transition-transform duration-300`}>
            <Icon className="size-5.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default KPICard;
