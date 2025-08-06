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
      <section className="py-16 bg-gray-50 dark:bg-gray-800" aria-labelledby="featured-cars-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="featured-cars-heading" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Vehicles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of premium pre-owned vehicles, each thoroughly inspected and ready for your next adventure.
            </p>
          </header>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading featured vehicles...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800" aria-labelledby="featured-cars-heading">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 id="featured-cars-heading" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Vehicles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked selection of premium pre-owned vehicles, each thoroughly inspected and ready for your next adventure.
          </p>
        </header>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {cars.map((car) => (
              <div key={car.id} role="listitem">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4" aria-hidden="true">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No featured vehicles available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for our latest featured vehicles.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="/inventory"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            aria-label="View all vehicles in our inventory"
          >
            View All Vehicles
          </a>
        </div>
      </div>
    </section>
  )
}
