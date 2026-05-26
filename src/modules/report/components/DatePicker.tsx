import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ date, setDate, placeholder = "Pick a date", className }: DatePickerProps) {
  const displayDate = (d: Date | undefined) => {
    if (!d) return placeholder;
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 justify-start text-left font-medium rounded-xl border border-border bg-background px-3 hover:bg-muted/50 cursor-pointer shadow-none",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
          {displayDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 bg-popover rounded-xl shadow-lg border border-border" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
