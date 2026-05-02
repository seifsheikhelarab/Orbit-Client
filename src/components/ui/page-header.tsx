import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  fullWidth?: boolean
}

function PageHeader({ 
  icon: Icon, 
  iconColor = "bg-primary text-on-primary",
  title, 
  description, 
  actions,
  className,
  fullWidth = false
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10", className)}>
      <div className={cn("flex items-center gap-5", fullWidth ? "" : "max-w-2xl")}>
        {Icon && (
          <div className={cn("p-4 rounded-xl shadow-sm shrink-0 transition-transform duration-150 hover:scale-105", iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-display-md font-bold tracking-tight text-on-surface">
            {title}
          </h1>
          {description && (
            <p className="text-body-lg text-on-surface-variant mt-2 max-w-xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-4 shrink-0">{actions}</div>}
    </div>
  )
}

export { PageHeader }
