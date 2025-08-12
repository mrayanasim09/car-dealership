"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { CarCard } from "@/components/car-card"
import { FilterPanel } from "@/components/filter-panel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
// CSS animation utilities are used to avoid client boundary issues

import { CarLoader } from "@/components/ui/car-loader"
import { FloatingCompareButton } from "@/components/floating-compare-button"
import type { Car } from "@/lib/types"

export type ListingsFilters = {
  search: string
  make: string
  minPrice: number | null
  maxPrice: number | null
  minYear: number | null
  maxYear: number | null
  maxMileage: number | null
}

interface ListingsContentProps {
  initialCars: Car[]
  filters?: ListingsFilters
  onFiltersChange?: (filters: ListingsFilters) => void
}

export function ListingsContent({ initialCars, filters: controlledFilters, onFiltersChange }: ListingsContentProps) {
  const [cars] = useState<Car[]>(initialCars)
  const [searchTerm, setSearchTerm] = useState("")
  const [internalFilters, setInternalFilters] = useState<ListingsFilters>({
    search: "",
    make: "",
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    maxMileage: null,
  })
  const activeFilters = controlledFilters ?? internalFilters

  // Sync internal state when controlled filters provided
  useEffect(() => {
    if (controlledFilters) setInternalFilters(controlledFilters)
  }, [controlledFilters])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const carsPerPage = 12
  const usingExternalFilters = Boolean(onFiltersChange)

  // Memoized filtered cars for better performance
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = searchTerm === "" || 
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesMake = activeFilters.make === "" || car.make === activeFilters.make
      
      const matchesPrice = (activeFilters.minPrice === null || car.price >= activeFilters.minPrice) &&
                          (activeFilters.maxPrice === null || car.price <= activeFilters.maxPrice)
      
      const matchesYear = (activeFilters.minYear === null || car.year >= activeFilters.minYear) &&
                         (activeFilters.maxYear === null || car.year <= activeFilters.maxYear)
      
      const matchesMileage = activeFilters.maxMileage === null || car.mileage <= activeFilters.maxMileage
      
      return matchesSearch && matchesMake && matchesPrice && matchesYear && matchesMileage
    })
  }, [cars, searchTerm, activeFilters])

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const startIndex = (currentPage - 1) * carsPerPage
  const endIndex = startIndex + carsPerPage
  const currentCars = filteredCars.slice(startIndex, endIndex)

  const handleFilter = useCallback((newFilters: ListingsFilters) => {
    setIsLoading(true)
    setCurrentPage(1)
    if (onFiltersChange) onFiltersChange(newFilters)
    else setInternalFilters(newFilters)
    setTimeout(() => setIsLoading(false), 300)
  }, [onFiltersChange])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Search Section */}
      <div className="mb-4 md:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search cars by make, model, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className={usingExternalFilters ? '' : "flex flex-col lg:flex-row gap-6 md:gap-8"}>
        {/* Filter Panel (internal) */}
        {!usingExternalFilters && (
          <div className="lg:w-1/4">
            <FilterPanel onFilter={handleFilter} />
          </div>
        )}

        {/* Cars Grid */}
        <div className={usingExternalFilters ? '' : "lg:w-3/4"}>
          {isLoading ? (
            <CarLoader />
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 md:mb-6">
                <p className="text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} vehicles
                </p>
              </div>

              {/* Cars Grid */}
              {currentCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 content-visibility-auto" role="list" aria-label="Car listings">
                  {currentCars.map((car, idx) => (
                    <div key={car.id} role="listitem" className="animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                      <CarCard car={car} showCompareButton={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2" role="navigation" aria-label="Pagination">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Compare Button */}
      <FloatingCompareButton />
    </div>
  )
}