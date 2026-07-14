import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin rounded-full border-current", {
  variants: {
    size: {
      xs: "h-3 w-3 border-[1.5px]",
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-[2.5px]",
      xl: "h-12 w-12 border-[3px]"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  color?: "primary" | "secondary" | "white" | "muted";
}

const colorClasses = {
  primary: "border-primary border-t-transparent",
  secondary: "border-secondary border-t-transparent",
  white: "border-white border-t-transparent",
  muted: "border-muted-foreground border-t-transparent"
} as const;

export function Spinner({ size, color = "primary", className }: SpinnerProps) {

  return (
    <div
      className={cn(
        spinnerVariants({ size }),
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
}
