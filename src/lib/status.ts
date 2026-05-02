import { cva, type VariantProps } from "class-variance-authority"

export type ApplicationStatus = "SAVED" | "APPLIED" | "PHONE_SCREEN" | "INTERVIEW" | "OFFER" | "CLOSED"

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "CLOSED",
]

export interface StatusConfig {
  label: string
  variant: VariantProps<typeof statusBadgeVariants>["variant"]
}

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  SAVED: { label: "Saved", variant: "saved" },
  APPLIED: { label: "Applied", variant: "applied" },
  PHONE_SCREEN: { label: "Phone Screen", variant: "phone_screen" },
  INTERVIEW: { label: "Interview", variant: "interview" },
  OFFER: { label: "Offer", variant: "offer" },
  CLOSED: { label: "Closed", variant: "closed" },
}

export const statusBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full px-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        saved: "bg-[var(--color-status-bg-saved)] text-[var(--color-status-text-saved)]",
        applied: "bg-[var(--color-status-bg-applied)] text-[var(--color-status-text-applied)]",
        phone_screen: "bg-[var(--color-status-bg-phone-screen)] text-[var(--color-status-text-phone-screen)]",
        interview: "bg-[var(--color-status-bg-interview)] text-[var(--color-status-text-interview)]",
        offer: "bg-[var(--color-status-bg-offer)] text-[var(--color-status-text-offer)]",
        closed: "bg-[var(--color-status-bg-closed)] text-[var(--color-status-text-closed)]",
        default: "bg-primary text-on-primary",
        secondary: "bg-secondary-container text-on-secondary-container",
        tertiary: "bg-accent-container text-on-accent-container",
        destructive: "bg-error-container text-on-error-container",
      },
      size: {
        sm: "px-2 h-5 text-[10px]",
        default: "px-2.5 h-6 text-xs",
        lg: "px-3 h-8 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const statusColors: Record<ApplicationStatus, { dot: string; border: string; bg: string; text: string }> = {
  SAVED: {
    dot: "bg-[var(--color-status-saved)]",
    border: "border-l-[var(--color-status-saved)]",
    bg: "bg-[var(--color-status-bg-saved)]",
    text: "text-[var(--color-status-text-saved)]",
  },
  APPLIED: {
    dot: "bg-[var(--color-status-applied)]",
    border: "border-l-[var(--color-status-applied)]",
    bg: "bg-[var(--color-status-bg-applied)]",
    text: "text-[var(--color-status-text-applied)]",
  },
  PHONE_SCREEN: {
    dot: "bg-[var(--color-status-phone-screen)]",
    border: "border-l-[var(--color-status-phone-screen)]",
    bg: "bg-[var(--color-status-bg-phone-screen)]",
    text: "text-[var(--color-status-text-phone-screen)]",
  },
  INTERVIEW: {
    dot: "bg-[var(--color-status-interview)]",
    border: "border-l-[var(--color-status-interview)]",
    bg: "bg-[var(--color-status-bg-interview)]",
    text: "text-[var(--color-status-text-interview)]",
  },
  OFFER: {
    dot: "bg-[var(--color-status-offer)]",
    border: "border-l-[var(--color-status-offer)]",
    bg: "bg-[var(--color-status-bg-offer)]",
    text: "text-[var(--color-status-text-offer)]",
  },
  CLOSED: {
    dot: "bg-[var(--color-status-closed)]",
    border: "border-l-[var(--color-status-closed)]",
    bg: "bg-[var(--color-status-bg-closed)]",
    text: "text-[var(--color-status-text-closed)]",
  },
}

export const STATUS_DASHBOARD_COLORS: Record<ApplicationStatus, string> = {
  SAVED: "#4f46e5",
  APPLIED: "#3b82f6",
  PHONE_SCREEN: "#8b5cf6",
  INTERVIEW: "#f59e0b",
  OFFER: "#10b981",
  CLOSED: "#64748b",
}
