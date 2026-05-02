import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
  className?: string
}

const maxWidthMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "w-full",
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-10",
}

function PageContainer({ 
  children, 
  maxWidth = "xl", 
  padding = "md",
  className 
}: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen pb-20 pt-24",
      paddingMap[padding],
      maxWidthMap[maxWidth],
      "mx-auto",
      className
    )}>
      {children}
    </div>
  )
}

export { PageContainer }
