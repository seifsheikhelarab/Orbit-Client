import { cn } from "@/lib/utils";

/**
 * Skeleton loading placeholder using pure CSS.
 * Replaces react-loading-skeleton to reduce bundle size.
 * Uses the shimmer animation defined in index.css.
 */
function Skeleton({ className, shimmer = true, style, ...props }: React.ComponentProps<"div"> & { shimmer?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl",
        shimmer
          ? "bg-surface-container relative overflow-hidden skeleton-shimmer"
          : "bg-surface-container-high animate-pulse",
        className
      )}
      style={{ height: style?.height || '1em', width: style?.width || '100%', ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}

function KanbanSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      {["SAVED", "APPLIED", "PHONE_SCREEN", "INTERVIEW", "OFFER", "CLOSED"].map((status) => (
        <div key={status} className="flex-1 space-y-3">
          <Skeleton className="h-8 w-24" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      {[...Array(rows)].map((_, row) => (
        <div key={row} className="flex gap-4">
          {[1, 2, 3, 4, 5].map((col) => (
            <Skeleton key={col} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, KanbanSkeleton, TableSkeleton }