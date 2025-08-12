"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export function CarLoader({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)} role="status" aria-label="Loading">
      <div className="relative" style={{ width: size, height: size * 0.5 }}>
        <Image
          src="/optimized/am-tycoons-logo.png"
          alt="AM Tycoons Inc. car logo"
          fill
          className="object-contain animate-car-drive drop-shadow-md"
          sizes={`${size}px`}
          priority={false}
        />
        {/* Wheels */}
        <div className="absolute bottom-0 left-[20%] w-3 h-3 rounded-full bg-primary animate-wheel-spin" />
        <div className="absolute bottom-0 right-[20%] w-3 h-3 rounded-full bg-primary animate-wheel-spin" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Loading inventory…</p>
    </div>
  )
}


