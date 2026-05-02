import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/status"
import { APPLICATION_STATUS_CONFIG, APPLICATION_STATUSES } from "@/lib/status"

const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
    SAVED: { bg: "bg-primary-fixed", text: "text-on-primary-fixed", border: "border-primary" },
    APPLIED: { bg: "bg-primary-fixed", text: "text-on-primary", border: "border-primary" },
    PHONE_SCREEN: { bg: "bg-error-container", text: "text-error", border: "border-error" },
    INTERVIEW: { bg: "bg-tertiary-fixed", text: "text-on-tertiary", border: "border-tertiary" },
    OFFER: { bg: "bg-tertiary-fixed-dim", text: "text-tertiary", border: "border-tertiary" },
    CLOSED: { bg: "bg-surface-container", text: "text-on-surface-variant", border: "border-outline" }
}

interface QuickStatusSelectProps {
    value: ApplicationStatus
    onChange: (status: ApplicationStatus) => void
    disabled?: boolean
    className?: string
    size?: "sm" | "default"
}

export function QuickStatusSelect({
    value,
    onChange,
    disabled,
    className,
    size = "sm"
}: QuickStatusSelectProps) {
    const colors = statusColors[value]

    return (
        <Select
            value={value}
            onValueChange={(v) => onChange(v as ApplicationStatus)}
            disabled={disabled}
        >
            <SelectTrigger
                className={cn(
                    "border cursor-pointer",
                    colors.bg,
                    colors.text,
                    colors.border,
                    size === "sm" ? "h-8 text-xs px-3" : "h-9 text-sm px-4",
                    className
                )}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {APPLICATION_STATUSES.map((status) => (
                    <SelectItem
                        key={status}
                        value={status}
                        className="cursor-pointer"
                    >
                        {APPLICATION_STATUS_CONFIG[status].label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
