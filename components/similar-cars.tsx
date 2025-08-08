"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CarCard } from "@/components/car-card"
import type { Car } from "@/lib/types"


interface SimilarCarsProps {
  currentCar: Car
  cars: Car[]
  maxSuggestions?: number
}

export function SimilarCars({ currentCar, cars, maxSuggestions = 3 }: SimilarCarsProps) {
  const [similarCars, setSimilarCars] = useState<Car[]>([])

  useEffect(() => {
    const calculateScore = (car: Car) => {
      let score = 0;
      const priceRange = 5000;
      const yearRange = 2;

      if (car.make?.toLowerCase() === currentCar.make?.toLowerCase()) score += 10;
      if (Math.abs(car.price - currentCar.price) <= priceRange) score += 5;
      if (Math.abs(car.year - currentCar.year) <= yearRange) score += 3;
      if (car.model?.toLowerCase() === currentCar.model?.toLowerCase()) score += 8;
      
      return score;
    }
    
    const findSimilarCars = () => {
      if (!Array.isArray(cars)) return; // Guard against undefined cars array
      
      const scoredCars = cars
        .filter(car => car.id !== currentCar.id && car.approved !== false)
        .map(car => ({ car, score: calculateScore(car) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score); // Corrected this line
      
      setSimilarCars(scoredCars.slice(0, maxSuggestions).map(item => item.car));
    }
    
    findSimilarCars()
  }, [currentCar, cars, maxSuggestions])

  if (similarCars.length === 0) {
    return null
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Similar Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}