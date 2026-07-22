import { formatDistanceToNow, format, differenceInDays } from "date-fns"

export function formatSalary(min?: number, max?: number): string | null {
    if (!min && !max) return null
    const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `${fmt(min)}+`
    return `< ${fmt(max!)}`
}

export function formatRelativeDate(dateStr?: string): string | null {
    if (!dateStr) return null
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
        return null
    }
}

export function formatDate(dateStr?: string): string {
    if (!dateStr) return "-"
    try {
        return format(new Date(dateStr), "MMM d, yyyy")
    } catch {
        return "-"
    }
}

export function formatFollowUp(dateStr?: string): { text: string; className: string } | "-" {
    if (!dateStr) return "-"
    try {
        const date = new Date(dateStr)
        const today = new Date(new Date().toDateString())
        if (date < today) {
            return { text: "Overdue", className: "text-error font-medium" }
        }
        return { text: formatDistanceToNow(date, { addSuffix: true }), className: "text-primary" }
    } catch {
        return { text: "-", className: "" }
    }
}

export function formatLastContact(dateStr?: string | null): { text: string; className: string } | null {
    if (!dateStr) return null
    try {
        const days = differenceInDays(new Date(), new Date(dateStr))
        if (days > 30) return { text: `${days}d ago`, className: "text-error font-medium" }
        if (days > 14) return { text: `${days}d ago`, className: "text-warning font-medium" }
        return { text: `${days}d ago`, className: "text-on-surface-variant" }
    } catch {
        return null
    }
}
