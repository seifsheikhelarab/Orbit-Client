import { LayoutGrid, Table2 } from "lucide-react"

import { cn } from "@/lib/utils"

type ViewMode = "kanban" | "table"

interface ViewToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  className?: string
}

function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("inline-flex rounded-full bg-surface-container-high p-1 gap-1 border border-outline-variant/30", className)}>
      <button
        type="button"
        onClick={() => onChange("kanban")}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 active:scale-95",
          value === "kanban"
            ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
            : "text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container"
        )}
      >
        <LayoutGrid className={cn("size-3.5 transition-transform duration-300", value === "kanban" && "scale-110")} />
        Kanban
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 active:scale-95",
          value === "table"
            ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
            : "text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container"
        )}
      >
        <Table2 className={cn("size-3.5 transition-transform duration-300", value === "table" && "scale-110")} />
        Table
      </button>
    </div>
  )
}

export { ViewToggle }
export type { ViewMode }
