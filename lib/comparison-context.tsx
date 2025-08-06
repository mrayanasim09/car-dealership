"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { Car } from "@/lib/types"

interface ComparisonContextType {
  selectedCars: Car[]
  addToComparison: (car: Car) => void
  removeFromComparison: (carId: string) => void
  clearComparison: () => void
  isInComparison: (carId: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

interface ComparisonProviderProps {
  children: ReactNode
}

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [selectedCars, setSelectedCars] = useState<Car[]>([])

  const addToComparison = (car: Car) => {
    if (selectedCars.length < 4 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car])
    }
  }

  const removeFromComparison = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId))
  }

  const clearComparison = () => {
    setSelectedCars([])
  }

  const isInComparison = (carId: string) => {
    return selectedCars.some(car => car.id === carId)
  }

  return (
    <ComparisonContext.Provider value={{
      selectedCars,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
} 