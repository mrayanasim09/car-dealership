"use client"

import { useState, useEffect } from "react"
import { getFeaturedCars } from "@/lib/firebase"
import { CarCard } from "@/components/car-card"
import type { Car } from "@/lib/types"

export function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsData = await getFeaturedCars()
        setCars(carsData)
      } catch (error) {
        console.error("Error loading featured cars:", error)
        setCars([])
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <header className="text-center mb-8 md:mb-12">
          <h2 id="featured-cars-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Featured Vehicles
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of premium pre-owned vehicles, each thoroughly inspected and ready for your next adventure.
          </p>
        </header>
        <div className="text-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading featured vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <header className="text-center mb-8 md:mb-12">
        <h2 id="featured-cars-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Featured Vehicles
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
          Discover our handpicked selection of premium pre-owned vehicles, each thoroughly inspected and ready for your next adventure.
        </p>
      </header>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" role="list">
          {cars.map((car) => (
            <div key={car.id} role="listitem">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 md:py-12">
          <div className="text-4xl md:text-6xl mb-4" aria-hidden="true">🚗</div>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            No featured vehicles available
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            Check back soon for our latest featured vehicles.
          </p>
        </div>
      )}

      <div className="text-center mt-8 md:mt-12">
        <a
          href="/inventory"
          className="inline-block bg-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          aria-label="View all vehicles in our inventory"
        >
          View All Vehicles
        </a>
      </div>
    </div>
  )
}
