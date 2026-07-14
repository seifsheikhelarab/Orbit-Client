import { format } from "date-fns"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface StatusHistoryItem {
    id: string
    applicationId: string
    fromStatus: string | null
    toStatus: string
    note: string | null
    changedAt: string
}

interface StatusHistoryTimelineProps {
    items: StatusHistoryItem[]
    isLoading?: boolean
}

const STATUS_LABELS: Record<string, string> = {
    SAVED: "Saved",
    APPLIED: "Applied",
    PHONE_SCREEN: "Phone Screen",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    CLOSED: "Closed"
}

export function StatusHistoryTimeline({ items, isLoading }: StatusHistoryTimelineProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6 border-b border-outline pb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-sm font-bold tracking-wider">Status History</h2>
            </div>

            {items && items.length > 0 ? (
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-outline" />

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="relative flex items-start gap-4 pl-8">
                                <div className={cn(
                                    "absolute left-2.5 w-3 h-3 rounded-full border-2 border-surface",
                                    index === 0 ? "bg-primary" : "bg-outline"
                                )} />

                                <div className="flex-1 p-4 rounded-xl border border-outline bg-surface">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {item.fromStatus ? (
                                                <>
                                                    <span className="text-sm font-bold uppercase tracking-wide">
                                                        {STATUS_LABELS[item.fromStatus] || item.fromStatus}
                                                    </span>
                                                    <span className="text-on-surface-variant">→</span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-on-surface-variant">Initial: </span>
                                            )}
                                            <span className="text-sm font-bold uppercase tracking-wide">
                                                {STATUS_LABELS[item.toStatus] || item.toStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
                                            {format(new Date(item.changedAt), "MMM d, yyyy 'at' h:mm a")}
                                        </div>
                                    </div>
                                    {item.note && (
                                        <p className="text-sm text-on-surface-variant mt-2">{item.note}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 border border-dashed border-outline rounded-xl">
                    <Clock className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                    <p className="text-sm text-on-surface-variant">No status history yet</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                        Status changes will appear here as they happen
                    </p>
                </div>
            )}
        </div>
    )
}
