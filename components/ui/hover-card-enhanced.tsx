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
    glow: "hover:shadow-xl hover:shadow-red-100 transition-all duration-300",
    scale: "hover:scale-105 transition-transform duration-300",
    border: "hover:border-red-300 transition-colors duration-300"
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white transition-all duration-300 cursor-pointer",
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

