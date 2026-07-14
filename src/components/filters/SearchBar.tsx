import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showShortcutHint?: boolean
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search jobs, companies, or tags...",
  className,
  showShortcutHint = true,
}: SearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setTimeout(() => { setLocalValue(value) }, 0)
  }, [value])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <div className={cn("relative flex-1 min-w-[320px] group", className)}>
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
        <Search className="size-5 text-on-surface-variant/40 group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-300" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-14 pl-14 pr-24 bg-surface-container-low/50 hover:bg-surface-container-low transition-all duration-300 border-none shadow-sm group-focus-within:shadow-xl group-focus-within:shadow-primary/5 group-focus-within:bg-surface rounded-2xl text-lg font-medium placeholder:text-on-surface-variant/30"
        data-search-input
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
        {showShortcutHint && !localValue && (
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-label-sm font-bold text-primary/40 bg-primary-container/30 rounded-lg border border-primary/10 group-focus-within:border-primary/20 transition-all">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
        {localValue && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="p-2 rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error-container/30 transition-all duration-200"
          >
            <X className="size-5" />
          </button>
        )}
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-focus-within:w-[calc(100%-2rem)] transition-all duration-500 ease-out-expo rounded-full" />
    </div>
  );
}

export { SearchBar };
