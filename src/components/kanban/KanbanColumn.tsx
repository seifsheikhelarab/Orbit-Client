import { memo, useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/status"
import { APPLICATION_STATUS_CONFIG, statusColors } from "@/lib/status"

interface KanbanColumnProps {
    status: ApplicationStatus
    count: number
    children: React.ReactNode
    onAddClick: () => void
    index?: number
}

export const KanbanColumn = memo(function KanbanColumn({
    status,
    count,
    children,
    onAddClick,
    index = 0
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    const [isAdding, setIsAdding] = useState(false)
    const config = APPLICATION_STATUS_CONFIG[status]
    const colors = statusColors[status]

    const handleAddClick = () => {
        setIsAdding(true)
        onAddClick()
        setTimeout(() => setIsAdding(false), 300)
    }

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col w-80 min-w-[20rem] shrink-0 rounded-2xl",
                "bg-surface-container-low",
                "transition-all duration-300 ease-out-quart",
                isOver && "ring-2 ring-primary/30 shadow-2xl shadow-primary/10 scale-[1.01]",
                colors.bg,
                "animate-in slide-in-from-bottom-4 fade-in duration-500"
            )}
            style={{ 
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'backwards'
            }}
        >
            <div className={cn("flex items-center justify-between p-4 border-b", colors.border.replace('border-l', 'border-b'))}>
                <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full shadow-sm animate-pulse", colors.dot, isOver && "scale-125")} />
                    <h3 className={cn("font-headline font-bold text-label-lg truncate", colors.text)}>{config.label}</h3>
                    <span className={cn(
                        "px-2.5 py-1 rounded-lg text-label-sm font-bold",
                        "bg-white/40 backdrop-blur-sm",
                        colors.text,
                        "transition-transform duration-200",
                        isOver && "scale-110"
                    )}>
                        {count}
                    </span>
                </div>
            </div>

            <div className={cn(
                "flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-340px)] scrollbar-thin",
                "transition-colors duration-200",
                isOver && "bg-primary/5"
            )}>
                {children}
            </div>

            <div className="p-4">
                <button
                    type="button"
                    onClick={handleAddClick}
                    className={cn(
                        "flex items-center justify-center gap-2 w-full py-3 rounded-xl text-label-sm font-semibold",
                        "text-on-surface-variant",
                        "transition-all duration-200 ease-out-quart",
                        "hover:text-primary hover:bg-primary-fixed-dim",
                        "active:scale-95 active:duration-100",
                        isAdding && "scale-95 ring-2 ring-primary/30"
                    )}
                >
                    <Plus className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isAdding && "rotate-90"
                    )} />
                    <span>Add</span>
                </button>
            </div>
        </div>
    )
})
