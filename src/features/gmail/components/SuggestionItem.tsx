import { Check, X, ArrowRightLeft, UserPlus, CalendarPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAcceptSuggestion, useDismissSuggestion } from "@/features/gmail/api/useGmail"

const TYPE_CONFIG = {
    STATUS_TRANSITION: { icon: ArrowRightLeft, label: "Status Change" },
    CONTACT_CREATE: { icon: UserPlus, label: "New Contact" },
    INTERVIEW_CREATE: { icon: CalendarPlus, label: "New Interview" }
} as const

interface SuggestionItemProps {
    suggestion: {
        id: string
        type: string
        suggestedValue: unknown
        inboxEntry?: { subject?: string } | null
    }
}

export function SuggestionItem({ suggestion }: SuggestionItemProps) {
    const accept = useAcceptSuggestion(suggestion.id)
    const dismiss = useDismissSuggestion(suggestion.id)
    const config = TYPE_CONFIG[suggestion.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.STATUS_TRANSITION
    const Icon = config.icon

    const description = (() => {
        const val = suggestion.suggestedValue as Record<string, unknown>
        if (suggestion.type === "STATUS_TRANSITION") {
            return `Move to ${String(val.status ?? "...")}`.replace(/_/g, " ")
        }
        if (suggestion.type === "CONTACT_CREATE") {
            return `Add ${String(val.name ?? "contact")}`
        }
        if (suggestion.type === "INTERVIEW_CREATE") {
            return `Log ${String(val.roundType ?? "interview").replace(/_/g, " ").toLowerCase()}`
        }
        return "Unknown suggestion"
    })()

    return (
        <div className={cn(
            "flex items-center justify-between gap-3 p-3 rounded-xl",
            "bg-surface-container-low hover:bg-surface-container transition-colors"
        )}>
            <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 p-1.5 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{description}</p>
                    {suggestion.inboxEntry?.subject && (
                        <p className="text-xs text-on-surface-variant/60 truncate">
                            via: {suggestion.inboxEntry.subject}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => accept.mutate()}
                    disabled={accept.isPending || dismiss.isPending}
                    aria-label="Accept suggestion"
                >
                    <Check className="w-3.5 h-3.5 text-success" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => dismiss.mutate()}
                    disabled={accept.isPending || dismiss.isPending}
                    aria-label="Dismiss suggestion"
                >
                    <X className="w-3.5 h-3.5 text-on-surface-variant" />
                </Button>
            </div>
        </div>
    )
}
