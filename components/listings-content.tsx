"use client"

import { useState, useMemo } from "react"
import { CarCard } from "@/components/car-card"
import { FilterPanel } from "@/components/filter-panel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { CarComparison } from "@/components/car-comparison"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FloatingCompareButton } from "@/components/floating-compare-button"
import type { Car } from "@/lib/types"

interface ListingsContentProps {
    initialCars: Car[];
}

export function ListingsContent({ initialCars }: ListingsContentProps) {
  const [cars] = useState<Car[]>(initialCars)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    search: "",
    make: "",
    minPrice: null as number | null,
    maxPrice: null as number | null,
    minYear: null as number | null,
    maxYear: null as number | null,
    maxMileage: null as number | null,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const carsPerPage = 12

  // Memoized filtered cars for better performance
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = searchTerm === "" || 
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesMake = filters.make === "" || car.make === filters.make
      
      const matchesPrice = (filters.minPrice === null || car.price >= filters.minPrice) &&
                          (filters.maxPrice === null || car.price <= filters.maxPrice)
      
      const matchesYear = (filters.minYear === null || car.year >= filters.minYear) &&
                         (filters.maxYear === null || car.year <= filters.maxYear)
      
      const matchesMileage = filters.maxMileage === null || car.mileage <= filters.maxMileage
      
      return matchesSearch && matchesMake && matchesPrice && matchesYear && matchesMileage
    })
  }, [cars, searchTerm, filters])

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const startIndex = (currentPage - 1) * carsPerPage
  const endIndex = startIndex + carsPerPage
  const currentCars = filteredCars.slice(startIndex, endIndex)

  const handleFilter = (newFilters: {
    search: string
    make: string
    minPrice: number | null
    maxPrice: number | null
    minYear: number | null
    maxYear: number | null
    maxMileage: number | null
  }) => {
    setIsLoading(true)
    setCurrentPage(1)
    setFilters(newFilters)
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 300)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search cars by make, model, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Panel */}
        <div className="lg:w-1/4">
          <FilterPanel onFilter={handleFilter} />
        </div>

        {/* Cars Grid */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredCars.length)} of {filteredCars.length} vehicles
                </p>
              </div>

              {/* Cars Grid */}
              {currentCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Car listings">
                  {currentCars.map((car) => (
                    <div key={car.id} role="listitem">
                      <CarCard car={car} showCompareButton={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4" aria-hidden="true">🚗</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
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
      <FloatingCompareButton availableCars={cars} />
    </div>
  )
}