// app/inventory/page.tsx

"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarCard } from "@/components/car-card"
import { getAllCars, isFirebaseAvailable } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Car } from "@/lib/types"

export default function InventoryPage() {
  const [inventoryCars, setInventoryCars] = useState<Car[]>([])
  const [error, setError] = useState<string | null>(null)
  const { loading: authLoading, isFirebaseAvailable } = useAuth()
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && isFirebaseAvailable) {
      const fetchCars = async () => {
        try {
          const allCars = await getAllCars()
          setInventoryCars(allCars.filter(car => car.isInventory !== false))
        } catch (error: any) {
          setError(error.message || 'Failed to load inventory.')
        } finally {
          setDataLoading(false)
        }
      }
      fetchCars()
    } else if (!authLoading && !isFirebaseAvailable) {
      setError("Firebase is not configured. Cannot load inventory.")
      setDataLoading(false)
    }
  }, [authLoading, isFirebaseAvailable])

  const isLoading = authLoading || dataLoading

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Our Complete Inventory</h1>
          <p className="text-lg text-gray-600">Each car is thoroughly inspected and comes with our guarantee.</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <h3>Unable to load inventory</h3>
            <p>{error}</p>
          </div>
        ) : inventoryCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventoryCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center py-12">No cars available at the moment.</p>
        )}
      </div>
      
      <Footer />
    </div>
  )
}