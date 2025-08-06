"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CloudinaryImage } from "@/components/cloudinary-image"
import { 
  Heart, 
  Share2, 
  Car, 
  MapPin, 
  Calendar,
  Phone,
  MessageCircle
} from "lucide-react"
import type { Car } from "@/lib/types"
import { useComparison } from "@/lib/comparison-context"

interface CarCardProps {
  car: Car
  showCompareButton?: boolean
}

export function CarCard({ car, showCompareButton = true }: CarCardProps) {
  const [isInterested, setIsInterested] = useState(false)
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()

  const handleCompareToggle = () => {
    if (isInComparison(car.id)) {
      removeFromComparison(car.id)
    } else {
      addToComparison(car)
    }
  }

  const handleCall = () => {
    window.open(`tel:+14243030386`, '_self')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/car/${car.id}`} className="block">
        <div className="relative">
          <CloudinaryImage
            src={car.images[0] || "/placeholder.jpg"}
            alt={car.title}
            width={400}
            height={300}
            className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
          
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
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 min-h-[32px] min-w-[32px]"
            onClick={(e) => {
              e.preventDefault()
              setIsInterested(!isInterested)
            }}
          >
            <Heart className={`h-4 w-4 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} />
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
                <Car className="h-3 w-3" />
                <span>{car.mileage.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{car.location}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showCompareButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompareToggle}
                className={`flex-1 text-xs py-2 min-h-[44px] ${
                  isInComparison(car.id) 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : ''
                }`}
              >
                <Share2 className="h-3 w-3 mr-1" />
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 min-h-[44px]"
            >
              <Phone className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Call</span>
              <span className="sm:hidden">Call</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
