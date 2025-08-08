"use client"

import { useState, useEffect, memo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CloudinaryImage } from "@/components/cloudinary-image"
import Image from "next/image"
import { 
  Heart, 
  Share2, 
  Car as CarIcon, 
  MapPin, 
  Calendar,
  Phone
} from "lucide-react"
import type { Car } from "@/lib/types"
import { useComparison } from "@/lib/comparison-context"
import { StarRating } from "@/components/star-rating"

interface CarCardProps {
  car: Car
  showCompareButton?: boolean
}

export const CarCard = memo(function CarCard({ car, showCompareButton = false }: CarCardProps) {
  const [isInterested, setIsInterested] = useState(false)
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()
  const [userRating, setUserRating] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`car-rating-${car.id}`)
      return saved ? Number(saved) : car.rating || 0
    }
    return car.rating || 0
  })
  const [averageRating, setAverageRating] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`car-rating-${car.id}`)
      return saved ? Number(saved) : car.rating || 0
    }
    return car.rating || 0
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`car-rating-${car.id}`, String(userRating))
      setAverageRating(Number(localStorage.getItem(`car-rating-${car.id}`)) || userRating)
    }
  }, [userRating, car.id])

  const handleCompareToggle = useCallback(() => {
    if (isInComparison(car.id)) {
      removeFromComparison(car.id)
    } else {
      addToComparison(car)
    }
  }, [isInComparison, car.id, removeFromComparison, addToComparison, car])

  const handleCall = useCallback(() => {
    window.open(`tel:+14243030386`, '_self')
  }, [])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }, [])

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/car/${car.id}`} className="block">
        <div className="relative">
          {car.images[0] && car.images[0].startsWith("/") ? (
            <Image
              src={car.images[0]}
              alt={car.title}
              width={400}
              height={300}
              className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <CloudinaryImage
              src={car.images[0] || "/placeholder.jpg"}
              alt={car.title}
              width={400}
              height={300}
              className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          
          {/* Price Badge */}
          <Badge className="absolute top-2 left-2 bg-red-600 text-white font-bold text-sm">
            {formatPrice(car.price)}
          </Badge>
          
          {/* Featured Badge */}
          {car.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white font-bold text-xs">
              Featured
            </Badge>
          )}
          
          {/* Interest Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 min-h-[44px] min-w-[44px] touch-manipulation"
            onClick={(e) => {
              e.preventDefault()
              setIsInterested(!isInterested)
            }}
            aria-label={isInterested ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Basic Info */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              <Link href={`/car/${car.id}`} className="hover:text-red-600 transition-colors">
                {car.title}
              </Link>
            </h3>
            
            {/* Car Details - Single Line for Mobile */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <CarIcon className="h-3 w-3" />
                <span>{car.mileage.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{car.location}</span>
              </div>
            </div>
          </div>

          {/* Rating Display */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StarRating rating={userRating} interactive={true} onRatingChange={setUserRating} />
              <span className="text-sm text-gray-600 dark:text-gray-300">{averageRating.toFixed(1)} / 5</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Performance</div>
              <div className="text-lg font-bold text-green-600">95</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {showCompareButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompareToggle}
                className={`flex-1 text-xs py-3 min-h-[48px] touch-manipulation ${
                  isInComparison(car.id) 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : ''
                }`}
                aria-label={isInComparison(car.id) ? 'Remove from comparison' : 'Add to comparison'}
              >
                <Share2 className="h-4 w-4 mr-1" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {isInComparison(car.id) ? 'Remove' : 'Compare'}
                </span>
                <span className="sm:hidden">
                  {isInComparison(car.id) ? 'Remove' : 'Compare'}
                </span>
              </Button>
            )}
            <Button
              onClick={handleCall}
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-3 min-h-[48px] touch-manipulation"
              aria-label="Call dealership"
            >
              <Phone className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Call</span>
              <span className="sm:hidden">Call</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
