"use client"

import { useState, useEffect } from "react"
import { supabasePublic } from "@/lib/supabase/client"
import { CarCard } from "@/components/car-card"
import type { Car } from "@/lib/types"

export function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabasePublic
          .from('cars')
          .select('*')
          .eq('approved', true)
          .eq('is_featured', true)
          .order('listed_at', { ascending: false })
          .limit(6)
        type CarRow = {
          id: string
          title: string
          make: string
          model: string
          year: number
          mileage: number
          price: number
          location: string
          images: string[]
        }
        setCars((error || !data) ? [] : (data as CarRow[] as unknown as Car[]))
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <div className="h-40 bg-muted rounded mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      {/* Heading and description are handled by page section */}
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
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No featured vehicles available
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            Check back soon for our latest featured vehicles.
          </p>
        </div>
      )}

      <div className="text-center mt-6 md:mt-10">
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
