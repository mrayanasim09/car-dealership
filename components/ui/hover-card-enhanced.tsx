"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface HoverCardEnhancedProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: "lift" | "glow" | "scale" | "border"
}

export function HoverCardEnhanced({
  children,
  className,
  hoverEffect = "lift"
}: HoverCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false)

  const effectClasses = {
    lift: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
    glow: "hover:shadow-xl hover:shadow-red-100 dark:hover:shadow-red-900/20 transition-all duration-300",
    scale: "hover:scale-105 transition-transform duration-300",
    border: "hover:border-red-300 dark:hover:border-red-600 transition-colors duration-300"
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground transition-all duration-300 cursor-pointer",
        effectClasses[hoverEffect],
        isHovered && "transform",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

