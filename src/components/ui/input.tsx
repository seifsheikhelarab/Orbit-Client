import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  error?: string
  hint?: string
}

function Input({ className, type, error, hint, id, name, maxLength, ...props }: InputProps) {
  const inputId = id || name
  const errorId = inputId ? `${inputId}-error` : undefined
  const hintId = inputId ? `${inputId}-hint` : undefined

  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        data-error={!!error}
        id={inputId}
        className={cn(
          "peer h-10 w-full min-w-0 rounded-xl border border-outline bg-surface-container-low px-4 py-2 text-base text-on-surface transition-all outline-none placeholder:text-transparent focus:border-primary focus:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-1 aria-invalid:ring-error/20",
          "autofill:shadow-[0_0_0_100px_theme(colors.surface.container.low)_inset]",
          "autofill:[-webkit-text-fill-color:theme(colors.on.surface)]",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={[
          error ? errorId : null,
          hint ? hintId : null
        ].filter(Boolean).join(" ") || undefined}
        maxLength={maxLength}
        {...props}
      />
      {(error || hint) && (
        <div className="mt-1.5 flex flex-col gap-0.5">
          {error && (
            <p id={errorId} className="text-xs text-error break-words" role="alert" aria-live="polite">
              {error}
            </p>
          )}
          {hint && !error && (
            <p id={hintId} className="text-xs text-on-surface-variant break-words">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export { Input }
