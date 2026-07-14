import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-label-sm font-bold uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary",
        secondary: "bg-secondary-container text-on-secondary-container",
        accent: "bg-accent text-on-accent",
        destructive: "bg-error text-on-error",
        outline: "border border-outline bg-transparent text-on-surface-variant hover:border-on-surface hover:text-on-surface",
        ghost: "text-on-surface-variant hover:bg-surface-container-low",
        link: "text-primary underline-offset-4 hover:underline",
        saved: "bg-status-bg-saved/80 text-status-text-saved border border-status-saved/20",
        applied: "bg-status-bg-applied/80 text-status-text-applied border border-status-applied/20",
        phone: "bg-status-bg-phone-screen/80 text-status-text-phone-screen border border-status-phone-screen/20",
        interview: "bg-status-bg-interview/80 text-status-text-interview border border-status-interview/20",
        offer: "bg-status-bg-offer/80 text-status-text-offer border border-status-offer/20",
        closed: "bg-status-bg-closed/80 text-status-text-closed border border-status-closed/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps extends React.ComponentProps<"span">,
  VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"
    return (
      <Comp
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
