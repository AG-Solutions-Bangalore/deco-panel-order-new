import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-60",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="peer/native-select h-10 w-full min-w-0 appearance-none truncate rounded-xl border border-input bg-background py-2 pr-10 pl-3 text-sm font-medium text-foreground shadow-xs transition-[border-color,box-shadow,background-color,color] outline-none select-none selection:bg-primary selection:text-primary-foreground hover:border-ring/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-8 data-[size=sm]:rounded-lg data-[size=sm]:py-1 data-[size=sm]:pr-8 data-[size=sm]:pl-2.5 [&_optgroup]:bg-popover [&_optgroup]:font-bold [&_optgroup]:text-muted-foreground [&_option]:bg-popover [&_option]:text-sm [&_option]:font-medium [&_option]:text-popover-foreground [&_option:checked]:bg-accent [&_option:checked]:text-accent-foreground [&_option:disabled]:text-muted-foreground"
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors select-none group-hover/native-select:text-foreground group-focus-within/native-select:text-foreground group-data-[size=sm]/native-select:right-2.5"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  style,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn(
        "bg-popover text-sm font-medium text-popover-foreground checked:bg-accent checked:text-accent-foreground disabled:text-muted-foreground",
        className
      )}
      style={{
        minHeight: "2.25rem",
        paddingBlock: "0.5rem",
        paddingInline: "0.75rem",
        lineHeight: "1.5",
        ...style,
      }}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  style,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-popover font-bold text-muted-foreground", className)}
      style={{
        paddingBlock: "0.5rem",
        paddingInline: "0.75rem",
        lineHeight: "1.5",
        ...style,
      }}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
