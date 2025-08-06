// app/browse/page.tsx

"use client"
export const dynamic = 'force-dynamic' // This must be AFTER "use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarCard } from "@/components/car-card"
import { SmartSearch } from "@/components/smart-search"
import { FilterPanel } from "@/components/filter-panel"
import { CarComparison } from "@/components/car-comparison"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getAllCars, isFirebaseAvailable } from "@/lib/firebase" // Corrected import
import type { Car } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Phone, MessageCircle, MessageSquare } from "lucide-react"

export default function BrowsePage() {
  const [allCars, setAllCars] = useState<Car[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("featured")
  const { loading: authLoading, isFirebaseAvailable } = useAuth()
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && isFirebaseAvailable) {
      const fetchCars = async () => {
        try {
          const carsFromDb = await getAllCars()
          setAllCars(carsFromDb.filter(car => car.approved !== false))
        } catch (err: any) {
          setError(err.message || "Failed to load cars.")
        } finally {
          setDataLoading(false)
        }
      }
      fetchCars()
    } else if (!authLoading && !isFirebaseAvailable) {
      setError("Firebase is not configured. Cannot load cars.")
      setDataLoading(false)
    }
  }, [authLoading, isFirebaseAvailable])
  
  const sortedCars = useMemo(() => {
    let carsToSort = [...allCars];
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

  const isLoading = authLoading || dataLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Browse Our Cars</h1>
          <p className="text-lg text-gray-600">Discover quality pre-owned vehicles.</p>
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
      
      <CarComparison availableCars={allCars} />
      <WhatsAppButton />
      <Footer />
    </div>
  )
}