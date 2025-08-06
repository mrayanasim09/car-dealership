"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({ rating, size = "md", interactive = false, onRatingChange }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1
    const isFilled = starValue <= rating
    const isHalfFilled = starValue - 0.5 <= rating && starValue > rating

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(starValue)}
        className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
      >
        <Star
          className={`${sizeClasses[size]} ${
            isFilled || isHalfFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      </button>
    )
  })

  return <div className="flex items-center space-x-1">{stars}</div>
}
