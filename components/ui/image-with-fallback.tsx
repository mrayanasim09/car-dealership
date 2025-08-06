"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Car } from "lucide-react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  fallbackSrc = "/placeholder.svg"
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(false)
    } else {
      setHasError(true)
    }
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-100 rounded", className)}>
        <Car className="h-12 w-12 text-gray-400" />
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={cn("absolute inset-0 bg-gray-200 animate-pulse rounded", className)} />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn("transition-opacity duration-300", isLoading && "opacity-0", className)}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}

