"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Popular car makes for autocomplete
const POPULAR_MAKES = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 
  'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia', 'Lexus', 
  'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Ram', 
  'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

interface ProcessedFilters {
  search: string
  make: string
  minPrice: number | null
  maxPrice: number | null
  minYear: number | null
  maxYear: number | null
  maxMileage: number | null
}

interface FilterPanelProps {
  onFilter: (filters: ProcessedFilters) => void
  initialFilters?: ProcessedFilters
  availableCars?: unknown[]
}

export function FilterPanel({ onFilter, initialFilters }: FilterPanelProps) {
  // Price range defaults
  const DEFAULT_MIN_PRICE = 0;
  const DEFAULT_MAX_PRICE = 100000;
  
  // Year range defaults
  const currentYear = new Date().getFullYear();
  const DEFAULT_MIN_YEAR = 1990;
  const DEFAULT_MAX_YEAR = currentYear + 1;
  
  // Mileage default
  const DEFAULT_MAX_MILEAGE = 200000;

  const [filters, setFilters] = useState<ProcessedFilters>({
    search: "",
    make: "",
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    maxMileage: null,
  })

  // Price range slider state
  const [priceRange, setPriceRange] = useState([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);
  const [yearRange, setYearRange] = useState([DEFAULT_MIN_YEAR, DEFAULT_MAX_YEAR]);
  const [mileageValue, setMileageValue] = useState([DEFAULT_MAX_MILEAGE]);

  // Mobile filter panel collapse state
  const [isOpen, setIsOpen] = useState(false);
  const [makeSearchTerm, setMakeSearchTerm] = useState("");
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);

  // Section collapse states for mobile
  const [sections, setSections] = useState({
    price: true,
    year: true,
    mileage: true,
    make: true
  });

  // Filter makes based on search term
  const filteredMakes = useMemo(() => {
    return POPULAR_MAKES.filter(make => 
      make.toLowerCase().includes(makeSearchTerm.toLowerCase())
    );
  }, [makeSearchTerm]);

  // Keep track of last emitted filters to avoid feedback loops
  const lastEmittedRef = useRef<string>("")

  // Sync from initialFilters when provided
  useEffect(() => {
    if (!initialFilters) return
    setFilters(prev => ({
      ...prev,
      search: initialFilters.search ?? "",
      make: initialFilters.make ?? "",
      minPrice: initialFilters.minPrice ?? null,
      maxPrice: initialFilters.maxPrice ?? null,
      minYear: initialFilters.minYear ?? null,
      maxYear: initialFilters.maxYear ?? null,
      maxMileage: initialFilters.maxMileage ?? null,
    }))
    setPriceRange([
      initialFilters.minPrice ?? DEFAULT_MIN_PRICE,
      initialFilters.maxPrice ?? DEFAULT_MAX_PRICE,
    ])
    setYearRange([
      initialFilters.minYear ?? DEFAULT_MIN_YEAR,
      initialFilters.maxYear ?? DEFAULT_MAX_YEAR,
    ])
    setMileageValue([initialFilters.maxMileage ?? DEFAULT_MAX_MILEAGE])
  }, [initialFilters, DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE, DEFAULT_MIN_YEAR, DEFAULT_MAX_YEAR, DEFAULT_MAX_MILEAGE])

  // Apply filters automatically when values change
  useEffect(() => {
    const updatedFilters: ProcessedFilters = {
      ...filters,
      minPrice: priceRange[0] === DEFAULT_MIN_PRICE ? null : priceRange[0],
      maxPrice: priceRange[1] === DEFAULT_MAX_PRICE ? null : priceRange[1],
      minYear: yearRange[0] === DEFAULT_MIN_YEAR ? null : yearRange[0],
      maxYear: yearRange[1] === DEFAULT_MAX_YEAR ? null : yearRange[1],
      maxMileage: mileageValue[0] === DEFAULT_MAX_MILEAGE ? null : mileageValue[0],
    }
    const serialized = JSON.stringify(updatedFilters)
    if (serialized !== lastEmittedRef.current) {
      lastEmittedRef.current = serialized
      onFilter(updatedFilters)
    }
  }, [priceRange, yearRange, mileageValue, filters, onFilter, DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE, DEFAULT_MIN_YEAR, DEFAULT_MAX_YEAR, DEFAULT_MAX_MILEAGE])

  const clearFilters = () => {
    setFilters({
      search: "",
      make: "",
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      maxMileage: null,
    });
    setPriceRange([DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE]);
    setYearRange([DEFAULT_MIN_YEAR, DEFAULT_MAX_YEAR]);
    setMileageValue([DEFAULT_MAX_MILEAGE]);
    setMakeSearchTerm("");
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.make) count++;
    if (priceRange[0] !== DEFAULT_MIN_PRICE || priceRange[1] !== DEFAULT_MAX_PRICE) count++;
    if (yearRange[0] !== DEFAULT_MIN_YEAR || yearRange[1] !== DEFAULT_MAX_YEAR) count++;
    if (mileageValue[0] !== DEFAULT_MAX_MILEAGE) count++;
    return count;
  }, [filters, priceRange, yearRange, mileageValue, DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE, DEFAULT_MIN_YEAR, DEFAULT_MAX_YEAR, DEFAULT_MAX_MILEAGE]);

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant="outline" 
          className="w-full flex items-center justify-between p-4 h-auto bg-card border-2 border-border hover:bg-accent"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`${isOpen || 'hidden lg:block'} sticky top-24`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Filter Cars</CardTitle>
            {activeFiltersCount > 0 && (
              <Button 
                onClick={clearFilters} 
                variant="ghost" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search</Label>
            <Input
              id="search"
              placeholder="Search by make, model, or keyword..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Make Filter with Autocomplete */}
          <Collapsible open={sections.make} onOpenChange={() => toggleSection('make')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Make</Label>
                  {filters.make && <Badge variant="secondary">{filters.make}</Badge>}
                </div>
                {sections.make ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <div className="relative">
                <Input
                  placeholder="Search makes..."
                  value={makeSearchTerm}
                  onChange={(e) => setMakeSearchTerm(e.target.value)}
                  onFocus={() => setShowMakeDropdown(true)}
                  onBlur={() => setTimeout(() => setShowMakeDropdown(false), 200)}
                  className="w-full"
                />
                {showMakeDropdown && filteredMakes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredMakes.slice(0, 10).map((make) => (
                      <button
                        key={make}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, make }));
                          setMakeSearchTerm(make);
                          setShowMakeDropdown(false);
                        }}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {filters.make && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, make: '' }));
                    setMakeSearchTerm('');
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Make
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Price Range Slider */}
          <Collapsible open={sections.price} onOpenChange={() => toggleSection('price')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Price Range</Label>
                  {(priceRange[0] !== DEFAULT_MIN_PRICE || priceRange[1] !== DEFAULT_MAX_PRICE) && (
                    <Badge variant="secondary">
                      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    </Badge>
                  )}
                </div>
                {sections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2">
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={DEFAULT_MIN_PRICE}
                  max={DEFAULT_MAX_PRICE}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min Price</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Math.max(DEFAULT_MIN_PRICE, Number(e.target.value) || 0);
                      setPriceRange([value, Math.max(value, priceRange[1])]);
                    }}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Price</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Math.min(DEFAULT_MAX_PRICE, Number(e.target.value) || DEFAULT_MAX_PRICE);
                      setPriceRange([Math.min(priceRange[0], value), value]);
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Year Range Slider */}
          <Collapsible open={sections.year} onOpenChange={() => toggleSection('year')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Year Range</Label>
                  {(yearRange[0] !== DEFAULT_MIN_YEAR || yearRange[1] !== DEFAULT_MAX_YEAR) && (
                    <Badge variant="secondary">
                      {yearRange[0]} - {yearRange[1]}
                    </Badge>
                  )}
                </div>
                {sections.year ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2">
              <div className="px-2">
                <Slider
                  value={yearRange}
                  onValueChange={setYearRange}
                  min={DEFAULT_MIN_YEAR}
                  max={DEFAULT_MAX_YEAR}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Min Year</Label>
                  <Input
                    type="number"
                    value={yearRange[0]}
                    onChange={(e) => {
                      const value = Math.max(DEFAULT_MIN_YEAR, Number(e.target.value) || DEFAULT_MIN_YEAR);
                      setYearRange([value, Math.max(value, yearRange[1])]);
                    }}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Year</Label>
                  <Input
                    type="number"
                    value={yearRange[1]}
                    onChange={(e) => {
                      const value = Math.min(DEFAULT_MAX_YEAR, Number(e.target.value) || DEFAULT_MAX_YEAR);
                      setYearRange([Math.min(yearRange[0], value), value]);
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Mileage Filter */}
          <Collapsible open={sections.mileage} onOpenChange={() => toggleSection('mileage')}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Max Mileage</Label>
                  {mileageValue[0] !== DEFAULT_MAX_MILEAGE && (
                    <Badge variant="secondary">
                      {mileageValue[0].toLocaleString()} miles
                    </Badge>
                  )}
                </div>
                {sections.mileage ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2">
              <div className="px-2">
                <Slider
                  value={mileageValue}
                  onValueChange={setMileageValue}
                  min={0}
                  max={DEFAULT_MAX_MILEAGE}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0 miles</span>
                  <span>{mileageValue[0].toLocaleString()} miles</span>
                </div>
              </div>
              <div>
                <Label className="text-xs">Max Mileage</Label>
                <Input
                  type="number"
                  value={mileageValue[0]}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(DEFAULT_MAX_MILEAGE, Number(e.target.value) || 0));
                    setMileageValue([value]);
                  }}
                  className="text-sm"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Mobile Close Button */}
          <div className="lg:hidden pt-4">
            <Button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
