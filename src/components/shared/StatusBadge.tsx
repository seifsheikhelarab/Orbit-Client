import * as React from "react"

import { cn } from "@/lib/utils"
import { 
  type ApplicationStatus, 
  APPLICATION_STATUS_CONFIG,
  APPLICATION_STATUSES,
  statusBadgeVariants 
} from "@/lib/status"

const UNKNOWN_STATUS = "CLOSED" as ApplicationStatus

interface StatusBadgeProps extends React.ComponentProps<"span"> {
  status: ApplicationStatus
  size?: "sm" | "default" | "lg"
}

function StatusBadge({ status, size = "default", className, ...props }: StatusBadgeProps) {
  const isValidStatus = APPLICATION_STATUSES.includes(status)
  const config = isValidStatus 
    ? APPLICATION_STATUS_CONFIG[status] 
    : APPLICATION_STATUS_CONFIG[UNKNOWN_STATUS]

  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(statusBadgeVariants({ variant: config.variant, size }), className)}
      {...props}
    >
      {config.label}
    </span>
  )
}

interface LargeStatusBadgeProps extends React.ComponentProps<"div"> {
  status: ApplicationStatus
  icon?: React.ReactNode
}

function LargeStatusBadge({ status, icon, className, ...props }: LargeStatusBadgeProps) {
  const isValidStatus = APPLICATION_STATUSES.includes(status)
  const config = isValidStatus 
    ? APPLICATION_STATUS_CONFIG[status] 
    : APPLICATION_STATUS_CONFIG[UNKNOWN_STATUS]

  return (
    <div
      data-slot="status-badge-large"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold",
        statusBadgeVariants({ variant: config.variant }),
        className
      )}
      {...props}
    >
      {icon}
      {config.label}
    </div>
  )
}

export { StatusBadge, LargeStatusBadge, statusBadgeVariants }
