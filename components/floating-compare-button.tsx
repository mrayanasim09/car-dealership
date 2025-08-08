"use client"

import { useState } from "react"
import { Scale, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useComparison } from "@/lib/comparison-context"
import { CarComparison } from "@/components/car-comparison"
import type { Car } from "@/lib/types"

interface FloatingCompareButtonProps {
  availableCars: Car[]
}

export function FloatingCompareButton({ availableCars }: FloatingCompareButtonProps) {
  const { selectedCars } = useComparison()
  const [showComparison, setShowComparison] = useState(false)

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
        <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center">
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
