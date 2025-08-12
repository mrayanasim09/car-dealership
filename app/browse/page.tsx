// app/browse/page.tsx

"use client"
export const dynamic = 'force-dynamic' // This must be AFTER "use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarCard } from "@/components/car-card"
import { SmartSearch } from "@/components/smart-search"
import { FilterPanel } from "@/components/filter-panel"


// Firebase server functions removed
import type { Car } from "@/lib/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabasePublic } from "@/lib/supabase/client"
import Script from 'next/script'

export default function BrowsePage() {
  const [allCars, setAllCars] = useState<Car[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("featured")
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabasePublic
          .from('cars')
          .select('*')
          .eq('approved', true)
          .order('listed_at', { ascending: false })
        if (error) throw error
        setAllCars((data || []) as unknown as Car[])
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cars."
        if (process.env.NODE_ENV !== 'production') console.error('Browse load error:', errorMessage)
        setError(errorMessage)
      } finally {
        setDataLoading(false)
      }
    }
    fetchCars()
  }, [])
  
  const sortedCars = useMemo(() => {
    const carsToSort = [...allCars];
    switch (sortBy) {
      case "price-low-high":
        return carsToSort.sort((a, b) => a.price - b.price);
      case "price-high-low":
          return carsToSort.sort((a, b) => b.price - a.price);
      case "mileage-low-high":
          return carsToSort.sort((a, b) => a.mileage - b.mileage);
      case "mileage-high-low":
          return carsToSort.sort((a, b) => b.mileage - a.mileage);
      case "year-newest":
          return carsToSort.sort((a, b) => b.year - a.year);
      case "year-oldest":
          return carsToSort.sort((a, b) => a.year - b.year);
      default:
        return carsToSort;
    }
  }, [allCars, sortBy]);

  const isLoading = dataLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Script
          id="browse-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: sortedCars.map((car, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${typeof window !== 'undefined' ? window.location.origin : ''}/car/${car.id}`,
                name: car.title,
              })),
            }),
          }}
        />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Browse Our Cars</h1>
          <p className="text-lg text-muted-foreground">Discover quality pre-owned vehicles.</p>
        </div>

        <div className="mb-8">
          <SmartSearch cars={allCars} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel onFilter={() => {}} />
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Available Vehicles ({sortedCars.length})</h2>
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="mileage-low-high">Mileage: Lowest First</option>
                <option value="mileage-high-low">Mileage: Highest First</option>
                <option value="year-newest">Year: Newest First</option>
                <option value="year-oldest">Year: Oldest First</option>
              </select>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : sortedCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">No cars found.</div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}