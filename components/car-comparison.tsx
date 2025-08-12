"use client"

import { useState, useMemo, useCallback } from "react"
import { X, Plus, Scale, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useComparison } from "@/lib/comparison-context"
import type { Car } from "@/lib/types"
import { StarRating } from "@/components/star-rating"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

interface CarComparisonProps {
  availableCars: Car[]
  initialCar?: Car
  onClose?: () => void
}

export function CarComparison({ availableCars, onClose }: CarComparisonProps) {
  const { selectedCars, addToComparison, removeFromComparison, clearComparison } = useComparison()
  const [isOpen, setIsOpen] = useState(false)
  const [showCarSelector, setShowCarSelector] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMake, setFilterMake] = useState("")

  // Memoize makes for better performance
  const makes = useMemo(() => Array.from(new Set(availableCars.map(car => car.make))), [availableCars])

  const handleAddCar = useCallback((car: Car) => {
    addToComparison(car)
    setShowCarSelector(false)
  }, [addToComparison])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }, [])

  const formatMileage = useCallback((mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage)
  }, [])

  // Memoize filtered cars for better performance
  const filteredCars = useMemo(() => {
    return availableCars.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMake = !filterMake || car.make === filterMake
      return matchesSearch && matchesMake
    })
  }, [availableCars, searchTerm, filterMake])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={`fixed bottom-20 right-6 z-40 bg-card shadow-lg hover:shadow-xl ${isOpen ? 'hidden' : ''}`}
        aria-label={`Compare cars (${selectedCars.length} selected)`}
      >
        <Scale className="h-4 w-4 mr-2" aria-hidden="true" />
        Compare Cars
        {selectedCars.length > 0 && (
          <Badge className="ml-2 bg-red-600" aria-label={`${selectedCars.length} cars selected`}>
            {selectedCars.length}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) onClose?.()
      }}>
        <DialogContent className="w-full max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <DialogHeader>
                <DialogTitle id="comparison-title" className="flex items-center">
                  <Scale className="h-5 w-5 mr-2" aria-hidden="true" />
                  Compare Cars ({selectedCars.length}/4)
                </DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                {selectedCars.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearComparison} aria-label="Clear all cars from comparison">
                    Clear All
                  </Button>
                )}
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" aria-label="Close comparison dialog">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </DialogClose>
              </div>
            </CardHeader>
            <CardContent>
          {selectedCars.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">Compare Cars</h3>
                <p className="text-muted-foreground mb-6">
                  Select up to 4 cars to compare their features and specifications
                </p>
              </div>
              
              {/* Car Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list" aria-label="Available cars to compare">
                {availableCars.slice(0, 8).map((car) => (
                  <div
                    key={car.id}
                    className="border rounded-lg p-4 cursor-pointer hover:border-red-500 hover:shadow-lg transition-all"
                    onClick={() => handleAddCar(car)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCar(car)}
                    aria-label={`Add ${car.title} to comparison`}
                  >
                    <Image
                      src={car.images[0] || "/optimized/placeholder.webp"}
                      alt={car.title}
                      width={200}
                      height={120}
                      className="w-full h-24 object-cover rounded mb-3"
                    />
                    <h4 className="font-semibold text-sm mb-1">{car.title}</h4>
                    <p className="text-red-600 font-bold text-sm">{formatPrice(car.price)}</p>
                    <p className="text-muted-foreground text-xs">{car.year} • {formatMileage(car.mileage)} mi</p>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => setShowCarSelector(true)}
                className="mt-6"
                variant="outline"
                aria-label="Browse more cars to compare"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Browse More Cars
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Cars Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label="Selected cars for comparison">
                {selectedCars.map((car) => (
                  <div key={car.id} className="relative border rounded-lg p-4" role="listitem">
                    <button
                      onClick={() => removeFromComparison(car.id)}
                      className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      aria-label={`Remove ${car.title} from comparison`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <Image
                      src={car.images[0] || "/placeholder.svg"}
                      alt={`${car.title} - ${car.year} ${car.make} ${car.model}`}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      unoptimized
                    />
                    <h3 className="font-bold text-sm mb-1">{car.title}</h3>
                    <p className="text-red-600 font-bold text-lg">{formatPrice(car.price)}</p>
                    <p className="text-muted-foreground text-xs">{car.year} • {formatMileage(car.mileage)} mi</p>
                  </div>
                ))}
                
                {selectedCars.length < 4 && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full flex items-center justify-center min-h-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => setShowCarSelector(true)}
                      className="text-muted-foreground flex flex-col items-center"
                      aria-label="Add another car to comparison"
                    >
                      <Plus className="h-8 w-8 mb-2" aria-hidden="true" />
                      Add Car
                    </Button>
                  </div>
                )}
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse" role="table" aria-label="Car comparison table">
                  <thead>
                    <tr className="bg-accent">
                      <th className="text-left p-4 font-semibold border-b" scope="col">Feature</th>
                      {selectedCars.map((car) => (
                        <th key={car.id} className="text-center p-4 font-semibold border-b min-w-[200px]" scope="col">
                          <div className="flex flex-col items-center">
                     <Image
                       src={car.images[0] || "/optimized/placeholder.webp"}
                              alt={`${car.title} - ${car.year} ${car.make} ${car.model}`}
                              width={120}
                              height={90}
                              className="w-28 h-20 object-cover rounded-lg mb-2 shadow"
                       priority={false}
                            />
                            <span className="text-sm font-medium">{car.make} {car.model}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium bg-accent">Price</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center font-bold text-red-600">
                          {formatPrice(car.price)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium bg-accent">Year</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center">{car.year}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium bg-accent">Mileage</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center">{formatMileage(car.mileage)} mi</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium bg-accent">Location</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center">{car.location}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium bg-accent">User Rating</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center">
                          <StarRating rating={car.rating || 0} size="sm" interactive={false} />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium bg-accent">Status</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center">
                          <Badge variant={car.approved ? 'default' : 'secondary'}>
                            {car.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium bg-gray-50 dark:bg-gray-800">Actions</td>
                      {selectedCars.map((car) => (
                        <td key={car.id} className="p-4 text-center">
                          <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white rounded-lg shadow font-semibold px-4 py-2 transition-all" aria-label={`View details for ${car.title}`}>
                            View Details
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Car Selection Modal */}
      <Dialog open={showCarSelector} onOpenChange={setShowCarSelector}>
        <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-y-auto p-0">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <DialogHeader>
                <DialogTitle id="car-selector-title">Select Cars to Compare</DialogTitle>
              </DialogHeader>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" aria-label="Close car selector">
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DialogClose>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden="true" />
                    <Input
                      placeholder="Search cars..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      aria-label="Search cars to compare"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={filterMake}
                    onChange={(e) => setFilterMake(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                    aria-label="Filter by car make"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Car Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Available cars to add to comparison">
                {filteredCars
                  .filter(car => !selectedCars.find(selected => selected.id === car.id))
                  .map((car) => (
                  <div
                    key={car.id}
                    className="border rounded-lg p-4 cursor-pointer hover:border-red-500 hover:shadow-lg transition-all"
                    onClick={() => handleAddCar(car)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCar(car)}
                    aria-label={`Add ${car.title} to comparison`}
                  >
                    <Image
                      src={car.images[0] || "/optimized/placeholder.webp"}
                      alt={`${car.title} - ${car.year} ${car.make} ${car.model}`}
                      width={200}
                      height={120}
                      className="w-full h-24 object-cover rounded mb-3"
                      priority={false}
                    />
                    <h4 className="font-semibold text-sm mb-1">{car.title}</h4>
                    <p className="text-red-600 font-bold text-sm">{formatPrice(car.price)}</p>
                    <p className="text-gray-500 text-xs">{car.year} • {formatMileage(car.mileage)} mi</p>
                    <p className="text-gray-500 text-xs">{car.location}</p>
                  </div>
                ))}
              </div>

              {filteredCars.filter(car => !selectedCars.find(selected => selected.id === car.id)).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                  No cars found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}

