"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudinaryImage } from "@/components/cloudinary-image"
import { ContactToBuy } from "@/components/contact-to-buy"
import { SimilarCars } from "@/components/similar-cars"
import { CarImageCarousel } from "@/components/car-image-carousel"
import { 
  Calendar, 
  MapPin, 
  Car, 
  Gauge, 
  Fuel, 
  Settings,
  Phone,
  Heart,
  Share2
} from "lucide-react"
import type { Car } from "@/lib/types"
import { useComparison } from "@/lib/comparison-context"

interface CarDetailsProps {
  car: Car
  similarCars?: Car[]
}

export function CarDetails({ car, similarCars = [] }: CarDetailsProps) {
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

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <CarImageCarousel images={car.images} title={car.title} />

          {/* Car Title and Price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {car.title}
              </h1>
              <div className="text-3xl font-bold text-red-600">
                {formatPrice(car.price)}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCompareToggle}
                className={`min-h-[44px] ${
                  isInComparison(car.id) 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : ''
                }`}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isInComparison(car.id) ? 'Remove from Compare' : 'Add to Compare'}
              </Button>
              
              <Button
                onClick={handleCall}
                className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setIsInterested(!isInterested)}
                className="min-h-[44px]"
              >
                <Heart className={`h-4 w-4 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-semibold">{car.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Make & Model</p>
                    <p className="font-semibold">{car.make} {car.model}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-semibold">{formatMileage(car.mileage)} mi</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{car.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          {(car.engine || car.transmission || car.fuelType || car.driveType) && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {car.engine && (
                    <div>
                      <p className="text-sm text-gray-600">Engine</p>
                      <p className="font-semibold">{car.engine}</p>
                    </div>
                  )}
                  
                  {car.transmission && (
                    <div>
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                  )}
                  
                  {car.fuelType && (
                    <div>
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-semibold">{car.fuelType}</p>
                    </div>
                  )}
                  
                  {car.driveType && (
                    <div>
                      <p className="text-sm text-gray-600">Drive Type</p>
                      <p className="font-semibold">{car.driveType}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {car.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Similar Cars */}
          {similarCars.length > 0 && (
            <SimilarCars cars={similarCars} currentCarId={car.id} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Section */}
          <ContactToBuy variant="card" />
          
          {/* VIN Information */}
          {car.vin && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">VIN</p>
                    <p className="font-mono text-sm">{car.vin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
