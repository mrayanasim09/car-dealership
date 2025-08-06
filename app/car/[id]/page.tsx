// app/car/[id]/page.tsx

"use client"
export const dynamic = 'force-dynamic' // This must be AFTER "use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { CarImageCarousel } from "@/components/car-image-carousel"
import { ContactToBuy } from "@/components/contact-to-buy"
import { CarComparison } from "@/components/car-comparison"
import { SimilarCars } from "@/components/similar-cars"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getAllCars, getCarById, isFirebaseAvailable } from "@/lib/firebase"
import type { Car } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"

interface CarPageProps {
  params: {
    id: string
  }
}

export default function CarPage({ params }: CarPageProps) {
  const [car, setCar] = useState<Car | null>(null)
  const [allCars, setAllCars] = useState<Car[]>([])
  const [error, setError] = useState(false)
  const { loading: authLoading, isFirebaseAvailable } = useAuth()
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && isFirebaseAvailable) {
      const fetchData = async () => {
        try {
          const [carData, allCarsData] = await Promise.all([
            getCarById(params.id),
            getAllCars(),
          ])
          
          if (!carData) {
            setError(true)
            return
          }
          
          setCar(carData)
          setAllCars(allCarsData)
        } catch (err) {
          setError(true)
        } finally {
          setDataLoading(false)
        }
      }
      fetchData()
    } else if (!authLoading && !isFirebaseAvailable) {
      setError(true)
      setDataLoading(false)
    }
  }, [params.id, authLoading, isFirebaseAvailable])

  if (authLoading || dataLoading) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
              <LoadingSpinner size="lg" />
          </div>
          <Footer />
        </div>
    );
  }

  if (error || !car) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: car.title }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <CarImageCarousel images={car.images} carTitle={car.title} />
              <SimilarCars currentCar={car} cars={allCars} />
          </div>
          <div className="space-y-6">
              <ContactToBuy car={car} />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
      <CarComparison availableCars={allCars} initialCar={car} />
    </div>
  )
}