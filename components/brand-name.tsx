"use client"

export function BrandName({ className = "" }: { className?: string }) {
  return <span className={`font-bold tracking-tight ${className}`.trim()}>AM Tycoons Inc.</span>
}


