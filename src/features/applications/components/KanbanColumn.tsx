import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/status"
import { APPLICATION_STATUS_CONFIG } from "@/lib/status"

interface KanbanColumnProps {
    status: ApplicationStatus
    count: number
    children: React.ReactNode
    onAddClick: () => void
}

const statusColors: Record<ApplicationStatus, { dot: string; border: string }> = {
    SAVED: { dot: "bg-primary", border: "border-l-primary" },
    APPLIED: { dot: "bg-secondary", border: "border-l-secondary" },
    PHONE_SCREEN: { dot: "bg-error", border: "border-l-error" },
    INTERVIEW: { dot: "bg-tertiary", border: "border-l-tertiary" },
    OFFER: { dot: "bg-tertiary-fixed", border: "border-l-tertiary" },
    CLOSED: { dot: "bg-surface-container", border: "border-l-outline" }
}

export const KanbanColumn = memo(function KanbanColumn({
    status,
    count,
    children,
    onAddClick
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    const config = APPLICATION_STATUS_CONFIG[status]
    const colors = statusColors[status]

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col w-72 min-w-[18rem] shrink-0 rounded-xl border border-outline transition-all duration-200",
                isOver ? "border-primary bg-primary/5 shadow-lg" : "border-outline bg-surface-container-low"
            )}
        >
            <div className={cn("flex items-center justify-between p-3 border-b-2", colors.border)}>
                <div className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", colors.dot)} />
                    <h3 className="font-bold text-sm uppercase tracking-wider truncate">{config.label}</h3>
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        "bg-surface-container-high text-on-surface-variant"
                    )}>
                        {count}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-320px)] scrollbar-thin">
                {children}
            </div>

            <div className="p-3 border-t border-outline/50">
                <button
                    onClick={onAddClick}
                    className={cn(
                        "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide",
                        "text-on-surface-variant hover:text-primary hover:bg-primary/10",
                        "transition-all duration-200 border border-transparent hover:border-primary"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                </button>
            </div>
        </div>
    )
})
