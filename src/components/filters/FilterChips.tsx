import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  value?: string
  icon?: React.ReactNode
  onRemove?: () => void
  className?: string
}

function FilterChip({ label, value, icon, onRemove, className }: FilterChipProps) {
  return (
    <div
      data-slot="filter-chip"
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-medium",
        "max-w-full",
        className
      )}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
      {value && <span className="opacity-70 truncate">: {value}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors shrink-0"
          aria-label={`Remove ${label}${value ? ` with value ${value}` : ""}`}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}

interface FilterChipsProps {
  children: React.ReactNode
  className?: string
}

function FilterChips({ children, className }: FilterChipsProps) {
  return (
    <div
      data-slot="filter-chips"
      role="group"
      aria-label="Active filters"
      className={cn("flex items-center gap-2 flex-wrap", className)}
    >
      {children}
    </div>
  )
}

export { FilterChip, FilterChips }
