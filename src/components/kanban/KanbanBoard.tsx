import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { toast } from "sonner"

import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import type { ApplicationStatus } from "@/lib/status"
import { APPLICATION_STATUSES, APPLICATION_STATUS_CONFIG } from "@/lib/status"
import type { Application } from "@/features/applications/api/useApplications"

interface KanbanBoardProps {
    applications: Application[]
    documentCounts?: Record<string, number>
    onStatusChange?: (id: string, status: ApplicationStatus) => Promise<void>
}

export function KanbanBoard({
    applications,
    documentCounts = {},
    onStatusChange
}: KanbanBoardProps) {
    const navigate = useNavigate()
    const [activeId, setActiveId] = useState<string | null>(null)
    const [optimisticApps, setOptimisticApps] = useState<Application[] | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const displayApps = optimisticApps ?? applications

    const appsByStatus = useMemo(() => {
        const grouped: Record<ApplicationStatus, Application[]> = {
            SAVED: [],
            APPLIED: [],
            PHONE_SCREEN: [],
            INTERVIEW: [],
            OFFER: [],
            CLOSED: []
        }
        displayApps.forEach((app) => {
            grouped[app.applicationStatus as ApplicationStatus].push(app)
        })
        return grouped
    }, [displayApps])

    const activeApp = useMemo(
        () => displayApps.find((app) => app.id === activeId),
        [displayApps, activeId]
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const appId = active.id as string
        const app = displayApps.find((a) => a.id === appId)
        if (!app) return

        const overId = over.id as string
        let newStatus: ApplicationStatus | null = null

        if (APPLICATION_STATUSES.includes(overId as ApplicationStatus)) {
            newStatus = overId as ApplicationStatus
        } else {
            const overApp = displayApps.find((a) => a.id === overId)
            if (overApp) {
                newStatus = overApp.applicationStatus as ApplicationStatus
            }
        }

        if (!newStatus || newStatus === app.applicationStatus) return

        if (onStatusChange) {
            setOptimisticApps(
                displayApps.map((a) =>
                    a.id === appId ? { ...a, applicationStatus: newStatus } : a
                )
            )

            try {
                await onStatusChange(appId, newStatus)
                toast.success(`Status updated to ${APPLICATION_STATUS_CONFIG[newStatus].label}`)
            } catch {
                setOptimisticApps(null)
                toast.error("Failed to update status")
            }
        }
    }

    const handleCardClick = (app: Application) => {
        navigate(`/app/applications/${app.id}`)
    }

    const handleAddClick = (status: ApplicationStatus) => {
        navigate(`/app/applications/new?status=${status}`)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-280px)] px-4">
                {APPLICATION_STATUSES.map((status, index) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        count={appsByStatus[status].length}
                        onAddClick={() => handleAddClick(status)}
                        index={index}
                    >
                        <SortableContext
                            items={appsByStatus[status].map((a) => a.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {appsByStatus[status].length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm py-12">
                                    Drop here
                                </div>
                            ) : (
                                appsByStatus[status].map((app) => (
                                    <KanbanCard
                                        key={app.id}
                                        application={app}
                                        isDragging={app.id === activeId}
                                        onClick={() => handleCardClick(app)}
                                        documentCount={documentCounts[app.id] || 0}
                                        index={appsByStatus[status].indexOf(app)}
                                    />
                                ))
                            )}
                        </SortableContext>
                    </KanbanColumn>
                ))}
            </div>
            <DragOverlay>
                {activeApp && (
                    <KanbanCard
                        application={activeApp}
                        isDragging
                        onClick={() => {}}
                        documentCount={documentCounts[activeApp.id] || 0}
                    />
                )}
            </DragOverlay>
        </DndContext>
    )
}
