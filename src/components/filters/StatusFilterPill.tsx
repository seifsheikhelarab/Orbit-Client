import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/status"
import { APPLICATION_STATUS_CONFIG } from "@/lib/status"

interface StatusFilterPillProps {
  status: ApplicationStatus
  selected: boolean
  onClick: () => void
  className?: string
}

function StatusFilterPill({ status, selected, onClick, className }: StatusFilterPillProps) {
  const config = APPLICATION_STATUS_CONFIG[status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm rounded-full border transition-all duration-150",
        "flex items-center gap-2",
        selected
          ? cn("bg-primary text-white border-primary shadow-sm")
          : cn(
              "bg-surface-container-low text-on-surface border-border",
              "hover:border-primary hover:text-primary"
            ),
        className
      )}
    >
      {selected && <Check className="size-3.5" />}
      <span className="capitalize">{config.label}</span>
    </button>
  )
}

interface StatusFilterGroupProps {
  statuses: ApplicationStatus[]
  selectedStatuses: ApplicationStatus[]
  onToggle: (status: ApplicationStatus) => void
  className?: string
}

function StatusFilterGroup({ 
  statuses, 
  selectedStatuses, 
  onToggle, 
  className 
}: StatusFilterGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {statuses.map((status) => (
        <StatusFilterPill
          key={status}
          status={status}
          selected={selectedStatuses.includes(status)}
          onClick={() => onToggle(status)}
        />
      ))}
    </div>
  )
}

export { StatusFilterPill, StatusFilterGroup }
