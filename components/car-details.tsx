"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContactToBuy } from "@/components/contact-to-buy"
import { SimilarCars } from "@/components/similar-cars"
import { 
  Calendar, 
  MapPin, 
  Car as CarIcon, 
  Gauge
} from "lucide-react"
import type { Car } from "@/lib/types"

interface CarDetailsProps {
  car: Car
  similarCars?: Car[]
  loading?: boolean
}

export function CarDetails({ car, similarCars = [], loading = false }: CarDetailsProps) {
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loading skeleton for main content */}
          <div className="lg:col-span-2 space-y-6">
              <div className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg mb-6"></div>
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded"></div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Loading skeleton for sidebar */}
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Vehicle Details
                {car.sold && (
                  <Badge className="bg-red-600 text-white font-bold">
                    SOLD
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-semibold">{car.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CarIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Make & Model</p>
                    <p className="font-semibold">{car.make} {car.model}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-semibold">{formatMileage(car.mileage)} mi</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{car.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          {(car.engine || car.transmission || car.fuelType || car.driveType || car.exteriorColor || car.interiorColor) && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {car.engine && (
                    <div>
                      <p className="text-sm text-muted-foreground">Engine</p>
                      <p className="font-semibold">{car.engine}</p>
                    </div>
                  )}
                  
                  {car.transmission && (
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                  )}
                  
                  {car.fuelType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{car.fuelType}</p>
                    </div>
                  )}
                  
                  {car.driveType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Drive Type</p>
                      <p className="font-semibold">{car.driveType}</p>
                    </div>
                  )}

                  {car.exteriorColor && (
                    <div>
                      <p className="text-sm text-muted-foreground">Exterior Color</p>
                      <p className="font-semibold">{car.exteriorColor}</p>
                    </div>
                  )}

                  {car.interiorColor && (
                    <div>
                      <p className="text-sm text-muted-foreground">Interior Color</p>
                      <p className="font-semibold">{car.interiorColor}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {Array.isArray(car.features) && car.features.length > 0 && (
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
          {Boolean(car.description && String(car.description).trim().length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Similar Cars */}
          {similarCars.length > 0 && (
            <SimilarCars cars={similarCars} currentCar={car} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Section */}
          <ContactToBuy car={car} variant="card" />
          
          {/* VIN Information */}
          {car.vin && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">VIN</p>
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
