"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin } from "lucide-react"

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    if (process.env.NODE_ENV !== 'production') {
      console.log("Search:", { searchTerm, make, model, year, priceRange })
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Find Your Perfect Vehicle
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use our advanced search to find the exact vehicle you&apos;re looking for
            </p>
          </div>

          {/* Search Form - Mobile First */}
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Quick Search - Mobile Optimized */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <Input
                type="text"
                placeholder="Search for make, model, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 bg-background border-border text-foreground placeholder-muted-foreground focus:border-red-500 focus:ring-red-500"
                aria-label="Search vehicles"
              />
            </div>

            {/* Advanced Filters - Collapsible on Mobile */}
            <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Filter className="w-5 h-5 mr-2" aria-hidden="true" />
                  Advanced Filters
                </h3>
              </div>

              {/* Filter Grid - Mobile Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Make */}
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-muted-foreground mb-2">
                    Make
                  </label>
                  <Select value={make} onValueChange={setMake}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="lexus">Lexus</SelectItem>
                      <SelectItem value="acura">Acura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-muted-foreground mb-2">
                    Model
                  </label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="civic">Civic</SelectItem>
                      <SelectItem value="accord">Accord</SelectItem>
                      <SelectItem value="camry">Camry</SelectItem>
                      <SelectItem value="corolla">Corolla</SelectItem>
                      <SelectItem value="f150">F-150</SelectItem>
                      <SelectItem value="escape">Escape</SelectItem>
                      <SelectItem value="3-series">3 Series</SelectItem>
                      <SelectItem value="5-series">5 Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-muted-foreground mb-2">
                    Year
                  </label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border max-h-60">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-muted-foreground mb-2">
                    Price Range
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select price" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="0-10000">Under $10,000</SelectItem>
                      <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                      <SelectItem value="30000-40000">$30,000 - $40,000</SelectItem>
                      <SelectItem value="40000+">$40,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                  aria-label="Search vehicles"
                >
                  <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                  Search Vehicles
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border text-muted-foreground hover:bg-accent py-3 px-6 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={() => {
                    setSearchTerm("")
                    setMake("")
                    setModel("")
                    setYear("")
                    setPriceRange("")
                  }}
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </form>

          {/* Quick Links - Mobile Optimized */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Honda','Toyota','Ford','Luxury'].map((label) => (
              <Button
                key={label}
                variant="ghost"
                className="flex flex-col items-center p-4 bg-card hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg transition-all duration-300"
                aria-label={`View all ${label} vehicles`}
              >
                <div className="mb-2 w-8 h-8 rounded-full bg-muted" aria-hidden="true" />
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>

          {/* Location Info - Mobile Optimized */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="text-sm">Serving Southern California</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Visit our showroom at 12440 Firestone Blvd, Suite 3025D, Norwalk, CA 90650
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
