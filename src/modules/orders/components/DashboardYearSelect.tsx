"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface YearSelectProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: string[] | any[];
}

export function DashboardYearSelect({
  selectedYear,
  setSelectedYear,
  availableYears,
}: YearSelectProps) {
  const { trigger } = useWebHaptics();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format years to string list
  const yearsList = Array.isArray(availableYears) 
    ? availableYears.map(item => typeof item === "object" ? item?.year || String(item) : String(item))
    : [];

  const handleYearSelect = (year: string) => {
    trigger("light");
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0 z-40" ref={containerRef}>
      {/* Shadcn-styled Date Picker Trigger Button */}
      <Button
        type="button"
        variant="outline"
        aria-label="Select dashboard year"
        onClick={() => {
          trigger("light");
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-[140px] md:w-[160px] justify-start text-left font-bold text-xs md:text-sm h-10 px-3 rounded-xl border border-border bg-panel text-text hover:bg-muted active:scale-[0.98] transition-all",
          isOpen && "border-primary/50 ring-2 ring-primary/10"
        )}
      >
        <Calendar className="mr-2 size-4 text-primary shrink-0" />
        <span className="flex-1 truncate">{selectedYear}</span>
        <ChevronDown className={cn(
          "ml-auto size-4 text-text-muted transition-transform duration-200 shrink-0",
          isOpen && "rotate-180"
        )} />
      </Button>

      {/* Popover content styled exactly like Shadcn Popover/Date Picker */}
      {isOpen && yearsList.length > 0 && (
        <div className="absolute right-0 mt-2 w-[140px] md:w-[160px] rounded-xl border border-border bg-panel shadow-md overflow-hidden p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {yearsList.map((year) => {
              const isSelected = year === selectedYear;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs md:text-sm font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                    isSelected 
                      ? "bg-primary text-primary-foreground font-bold" 
                      : "text-text hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="truncate">{year}</span>
                  {isSelected && <Check className="size-4 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default DashboardYearSelect;
