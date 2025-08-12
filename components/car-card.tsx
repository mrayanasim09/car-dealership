"use client"

import { useState, useEffect, memo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { 
  Share2, 
  Car as CarIcon, 
  MapPin, 
  Calendar
} from "lucide-react"
import type { Car } from "@/lib/types"
import { useComparison } from "@/lib/comparison-context"
// StarRating import removed as it's not used

interface CarCardProps {
  car: Car
  showCompareButton?: boolean
}

export const CarCard = memo(function CarCard({ car, showCompareButton = false }: CarCardProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()
  const [userRating] = useState<number>(() => {
    if (typeof window !== "undefined" && car?.id) {
      const saved = localStorage.getItem(`car-rating-${car.id}`)
      return saved ? Number(saved) : car.rating || 0
    }
    return car?.rating || 0
  })
  const [, setAverageRating] = useState<number>(() => {
    if (typeof window !== "undefined" && car?.id) {
      const saved = localStorage.getItem(`car-rating-${car.id}`)
      return saved ? Number(saved) : car.rating || 0
    }
    return car?.rating || 0
  })

  useEffect(() => {
    if (typeof window !== "undefined" && car?.id) {
      localStorage.setItem(`car-rating-${car.id}`, String(userRating))
      setAverageRating(Number(localStorage.getItem(`car-rating-${car.id}`)) || userRating)
    }
  }, [userRating, car?.id])

  const handleCompareToggle = useCallback(() => {
    if (!car?.id) return
    if (isInComparison(car.id)) {
      removeFromComparison(car.id)
    } else {
      addToComparison(car)
    }
  }, [isInComparison, removeFromComparison, addToComparison, car])

  // no-op placeholder removed

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }, [])

  // Add safety checks for car data
  if (!car || !car.id) {
    console.error('CarCard: Invalid car data received:', car)
    return null
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-card border border-border touch-card">
      <Link href={`/car/${car.id}`} className="block" aria-label={`View details for ${car.title}`}>
        <div className="relative aspect-video">
          {car.images && car.images[0] && typeof car.images[0] === 'string' && car.images[0].startsWith("/") ? (
            <Image
              src={car.images[0] as string}
              alt={`${car.title || 'Car'} - ${car.year || 'N/A'} ${car.make || 'N/A'} ${car.model || 'N/A'}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <Image
              src={car.images && car.images[0] ? (car.images[0] as string) : "/optimized/placeholder.webp"}
              alt={`${car.title || 'Car'} - ${car.year || 'N/A'} ${car.make || 'N/A'} ${car.model || 'N/A'}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Price Badge */}
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground font-bold text-sm" aria-label={`Price: ${formatPrice(car.price || 0)}`}>
            {formatPrice(car.price || 0)}
          </Badge>

          {/* Featured Badge */}
          {car.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-white font-bold text-xs" aria-label="Featured vehicle">
              Featured
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Basic Info */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              <Link href={`/car/${car.id}`} className="hover:text-primary transition-colors" aria-label={`View details for ${car.title || 'Car'}`}>
                {car.title || 'Untitled Vehicle'}
              </Link>
            </h3>
            
            {/* Car Details - Single Line for Mobile */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3" role="list" aria-label="Vehicle specifications">
              <div className="flex items-center gap-1" role="listitem">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-1" role="listitem">
                <CarIcon className="h-3 w-3" aria-hidden="true" />
                <span>{car.mileage.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center gap-1" role="listitem">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                <span className="truncate max-w-[80px]">{car.location}</span>
              </div>
            </div>
          </div>

          {/* Simple metadata row */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{car.make} {car.model}</span>
            <span>{car.year}</span>
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
                aria-label={isInComparison(car.id) ? `Remove ${car.title} from comparison` : `Add ${car.title} to comparison`}
                aria-pressed={isInComparison(car.id)}
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
            <Link href={`/car/${car.id}`} className="flex-1">
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-3 min-h-[48px] touch-manipulation" aria-label={`See full details for ${car.title}`}>
                See Full Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
