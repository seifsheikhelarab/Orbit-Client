import * as React from "react"
import { Filter, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface FilterButtonProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

function FilterButton({ label, active = false, onClick, className }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center gap-x-2 rounded-xl px-4 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-on-primary"
          : "bg-surface-container text-on-surface hover:bg-surface-container-high",
        className
      )}
    >
      {label}
      <ChevronDown className="size-4" />
    </button>
  )
}

interface FilterPanelProps {
  children: React.ReactNode
  className?: string
}

function FilterPanel({ children, className }: FilterPanelProps) {
  return (
    <div
      data-slot="filter-panel"
      className={cn("flex items-center gap-3 flex-wrap", className)}
    >
      {children}
    </div>
  )
}

interface AllFiltersButtonProps {
  activeFiltersCount?: number
  onClick?: () => void
  className?: string
}

function AllFiltersButton({ activeFiltersCount = 0, onClick, className }: AllFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center gap-x-2 rounded-xl px-4 text-sm font-medium transition-colors bg-surface-container text-on-surface hover:bg-surface-container-high relative",
        activeFiltersCount > 0 && "bg-primary text-on-primary",
        className
      )}
    >
      <Filter className="size-4" />
      <span>All Filters</span>
      {activeFiltersCount > 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 size-5 rounded-full text-label-sm font-bold flex items-center justify-center",
          activeFiltersCount > 0 ? "bg-error text-white" : "bg-primary text-white"
        )}>
          {activeFiltersCount}
        </span>
      )}
    </button>
  )
}

export { FilterButton, FilterPanel, AllFiltersButton }
