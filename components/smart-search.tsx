// components/smart-search.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Car } from "@/lib/types"

interface SmartSearchProps {
  cars: Car[]
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SmartSearch({ cars = [], onSearch, placeholder = "Search by make, model, year, or keyword..." }: SmartSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Car[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length > 1 && Array.isArray(cars)) {
      const filtered = cars.filter(car => 
        (car.title?.toLowerCase().includes(query.toLowerCase())) ||
        (car.make?.toLowerCase().includes(query.toLowerCase())) ||
        (car.model?.toLowerCase().includes(query.toLowerCase())) ||
        (car.year?.toString().includes(query))
      ).slice(0, 5)
      
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query, cars])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(price)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-10 py-3 text-lg border-2"
            />
        </div>
        {isOpen && suggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-50">
                <CardContent className="p-0">
                    {suggestions.map((car) => (
                      <Link key={car.id} href={`/car/${car.id}`} className="block p-3 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                          <h4 className="font-semibold">{car.title}</h4>
                          <p className="text-sm text-gray-600">{car.year} • {formatPrice(car.price)}</p>
                      </Link>
                    ))}
                </CardContent>
            </Card>
        )}
    </div>
  )
}