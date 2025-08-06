"use client"

import { useState } from "react"
import Image from "next/image"

interface CloudinaryImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
  crop?: string
  sizes?: string
  loading?: "lazy" | "eager"
  placeholder?: "blur" | "empty"
  fetchPriority?: "high" | "low" | "auto"
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  crop = "fill",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  loading = "lazy",
  placeholder = "blur",
  fetchPriority = "auto"
}: CloudinaryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Handle loading state
  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setImageError(true)
    console.error(`Failed to load image: ${src}`)
  }

  // If image failed to load, show placeholder
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Image not available
        </span>
      </div>
    )
  }

  // Check if it's a Cloudinary URL and optimize it
  const isCloudinaryUrl = src.includes('cloudinary.com')
  const optimizedSrc = isCloudinaryUrl 
    ? src.replace('/upload/', '/upload/f_auto,q_auto,w_auto/')
    : src

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        placeholder={placeholder}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
        style={{
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      )}
    </div>
  )
}
