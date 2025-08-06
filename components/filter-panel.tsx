"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FilterPanelProps {
  onFilter: (filters: any) => void
}

export function FilterPanel({ onFilter }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    search: "",
    make: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    maxMileage: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    const processedFilters = {
      ...filters,
      minPrice: filters.minPrice ? Number.parseInt(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? Number.parseInt(filters.maxPrice) : null,
      minYear: filters.minYear ? Number.parseInt(filters.minYear) : null,
      maxYear: filters.maxYear ? Number.parseInt(filters.maxYear) : null,
      maxMileage: filters.maxMileage ? Number.parseInt(filters.maxMileage) : null,
    }
    onFilter(processedFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      make: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      maxMileage: "",
    }
    setFilters(clearedFilters)
    onFilter(clearedFilters)
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filter Cars</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Make, model, or keyword..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="make">Make</Label>
          <Select value={filters.make} onValueChange={(value) => handleFilterChange("make", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Make</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="mercedes">Mercedes</SelectItem>
              <SelectItem value="audi">Audi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minYear">Min Year</Label>
            <Input
              id="minYear"
              type="number"
              placeholder="Any"
              value={filters.minYear}
              onChange={(e) => handleFilterChange("minYear", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="maxYear">Max Year</Label>
            <Input
              id="maxYear"
              type="number"
              placeholder="Any"
              value={filters.maxYear}
              onChange={(e) => handleFilterChange("maxYear", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="maxMileage">Max Mileage</Label>
          <Input
            id="maxMileage"
            type="number"
            placeholder="Any"
            value={filters.maxMileage}
            onChange={(e) => handleFilterChange("maxMileage", e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={applyFilters} className="flex-1 bg-red-600 hover:bg-red-700">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
