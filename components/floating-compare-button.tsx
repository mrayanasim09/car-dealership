"use client"

import { useState, useEffect } from "react"
import { Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useComparison } from "@/lib/comparison-context"
import { CarComparison } from "@/components/car-comparison"
import type { Car } from "@/lib/types"

export function FloatingCompareButton() {
  const { selectedCars } = useComparison()
  const [showComparison, setShowComparison] = useState(false)
  const [availableCars, setAvailableCars] = useState<Car[]>([])

  useEffect(() => {
    // Fetch cars data when component mounts
    const fetchCars = async () => {
      try {
        // Import client-safe Supabase
        const { supabasePublic } = await import("@/lib/supabase/client")
        const { data } = await supabasePublic
          .from('cars')
          .select('*')
          .eq('approved', true)
          .order('listed_at', { ascending: false })
          .limit(12)
        const cars = (data || []) as unknown as Car[]
        setAvailableCars(cars)
      } catch (error) {
        console.error("Error loading cars for comparison:", error)
        setAvailableCars([])
      }
    }

    fetchCars()
  }, [])

  if (selectedCars.length === 0) {
    return (
      <Button
        onClick={() => setShowComparison(true)}
        className="fixed bottom-4 left-4 z-40 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 flex items-center justify-center"
        aria-label="Open car comparison"
      >
        <Scale className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={() => setShowComparison(true)}
        className="fixed bottom-4 left-4 z-40 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 flex items-center justify-center relative"
        aria-label={`Compare ${selectedCars.length} cars`}
      >
        <Scale className="h-6 w-6" />
        <Badge
          variant="warning"
          className="absolute -top-2 -right-2 text-xs font-bold min-w-[20px] h-5 flex items-center justify-center"
        >
          {selectedCars.length}
        </Badge>
      </Button>

      {showComparison && (
        <CarComparison 
          availableCars={availableCars} 
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  )
}
