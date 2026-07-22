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

// eslint-disable-next-line react-refresh/only-export-components
export { StatusBadge, statusBadgeVariants }
