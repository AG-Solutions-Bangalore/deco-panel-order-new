import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDisplayDate } from "@/utils/date";

type TriggerHaptic = (pattern: "light" | "medium" | "heavy") => void;

interface OrderDatePickerProps {
  orderDate: string;
  onOrderDateChange: (date: string) => void;
  trigger: TriggerHaptic;
}

function getDateObject(dateStr: string) {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateToString(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDisplayDateString(dateStr: string) {
  return formatDisplayDate(dateStr) || "Select date";
}

export function OrderDatePicker({
  orderDate,
  onOrderDateChange,
  trigger,
}: OrderDatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 select-none">
        <CalendarIcon className="size-3.5 text-primary" />
        Order Date
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={() => trigger("light")}
            className="w-full bg-background border border-border hover:border-border-hover focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-all cursor-pointer text-left flex items-center justify-between text-text"
          >
            <span>{getDisplayDateString(orderDate)}</span>
            <CalendarIcon className="size-4 text-text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-50 bg-popover border border-border rounded-2xl shadow-xl"
          align="start"
        >
          <Calendar
            mode="single"
            selected={getDateObject(orderDate)}
            onSelect={(date) => {
              if (date) {
                trigger("medium");
                onOrderDateChange(formatDateToString(date));
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
