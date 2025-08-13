'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ListingsContent, type ListingsFilters } from '@/components/listings-content'
import { FilterPanel } from '@/components/filter-panel'
import { CarLoader } from '@/components/ui/car-loader'
import { supabasePublic } from '@/lib/supabase/client'
import type { Car } from '@/lib/types'
import Script from 'next/script'
import { useCspNonce } from '@/hooks/use-csp-nonce'
// CSS animation utilities are used to avoid client boundary issues

export default function ListingsPage() {
  const nonce = useCspNonce()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ListingsFilters>({
    search: '',
    make: '',
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    maxMileage: null,
  })

  useEffect(() => {
    async function fetchCars() {
      try {
        if (process.env.NODE_ENV !== 'production') console.log("🔄 Starting to fetch cars...")
        
        const { data, error } = await supabasePublic
          .from('cars')
          .select('*')
          .eq('approved', true)
          .eq('is_inventory', true)
          .order('listed_at', { ascending: false })
        type CarRow = {
          id: string
          title: string
          make: string
          model: string
          year: number
          mileage: number
          price: number
          location: string
          images: string[]
          approved: boolean
          is_inventory: boolean
          is_featured?: boolean
          listed_at: string | null
          exterior_color?: string | null
          interior_color?: string | null
        }
        const rows = (error || !data) ? [] : (data as CarRow[])
        const fetchedCars: Car[] = rows.map(r => ({
          id: r.id,
          title: r.title,
          make: r.make,
          model: r.model,
          year: r.year,
          mileage: r.mileage,
          price: r.price,
          location: r.location,
          images: r.images,
          approved: r.approved,
          isFeatured: Boolean(r.is_featured),
          isInventory: Boolean(r.is_inventory),
          listedAt: r.listed_at ? new Date(r.listed_at) : new Date(),
          description: '',
          contact: { phone: '', whatsapp: '' },
          rating: 0,
          reviews: [],
        }))
        
        if (process.env.NODE_ENV !== 'production') console.log(`✅ Loaded ${fetchedCars.length} cars from database`)

        // Debug: Log the first car if it exists
        if (fetchedCars.length > 0) {
          if (process.env.NODE_ENV !== 'production') console.log("🔍 First car data:", JSON.stringify(fetchedCars[0], null, 2))
        } else {
          if (process.env.NODE_ENV !== 'production') console.log("⚠️ No cars found in database")
        }
        
        setCars(fetchedCars)
      } catch (err) {
        console.error('❌ Failed to load cars:', err)
        setError('Failed to load inventory. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <CarLoader size={144} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <Script
          id="listings-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: cars.map((car, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${typeof window !== 'undefined' ? window.location.origin : ''}/car/${car.id}`,
                name: car.title,
              })),
            }).replace(/</g, '\\u003c').replace(/<\/script/gi, '<\\/script'),
          }}
        />
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-4">Our Complete Inventory</h1>
          <p className="text-lg text-muted-foreground">Browse our complete selection of quality pre-owned vehicles at <span className="font-bold">AM Tycoons Inc.</span></p>
          {cars.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {cars.length} vehicles
            </p>
          )}
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Unable to load inventory</h3>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">No vehicles available</h3>
              <p className="text-yellow-600 dark:text-yellow-300 text-sm">
                We currently don&apos;t have any vehicles in our inventory. Please check back later.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 content-visibility-auto">
            {/* Sticky filter area & chips container */}
            <aside className="lg:w-1/4 lg:sticky lg:top-24 self-start">
              <div className="mb-4 hidden lg:block text-sm text-muted-foreground">Filters</div>
              {([
                filters.make ? { key: 'make', label: `Make: ${filters.make}` } : null,
                filters.minPrice !== null ? { key: 'minPrice', label: `Min: $${filters.minPrice}` } : null,
                filters.maxPrice !== null ? { key: 'maxPrice', label: `Max: $${filters.maxPrice}` } : null,
                filters.minYear !== null ? { key: 'minYear', label: `From: ${filters.minYear}` } : null,
                filters.maxYear !== null ? { key: 'maxYear', label: `To: ${filters.maxYear}` } : null,
                filters.maxMileage !== null ? { key: 'maxMileage', label: `Max mi: ${filters.maxMileage}` } : null,
              ].filter(Boolean) as { key: keyof ListingsFilters; label: string }[]).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {([
                    filters.make ? { key: 'make', label: `Make: ${filters.make}` } : null,
                    filters.minPrice !== null ? { key: 'minPrice', label: `Min: $${filters.minPrice}` } : null,
                    filters.maxPrice !== null ? { key: 'maxPrice', label: `Max: $${filters.maxPrice}` } : null,
                    filters.minYear !== null ? { key: 'minYear', label: `From: ${filters.minYear}` } : null,
                    filters.maxYear !== null ? { key: 'maxYear', label: `To: ${filters.maxYear}` } : null,
                    filters.maxMileage !== null ? { key: 'maxMileage', label: `Max mi: ${filters.maxMileage}` } : null,
                  ].filter(Boolean) as { key: keyof ListingsFilters; label: string }[]).map((f) => (
                    <button
                      key={f.key}
                      className="px-2.5 py-1.5 rounded-full bg-accent text-foreground border border-border text-xs hover:bg-accent/80"
                      onClick={() => setFilters(prev => ({ ...prev, [f.key]: f.key === 'make' ? '' : null }))}
                      aria-label={`Remove filter ${f.label}`}
                    >
                      {f.label}
                      <span className="ml-1">×</span>
                    </button>
                  ))}
                </div>
              )}
              {/* Actual FilterPanel wired to lifted filters */}
              <div className="mt-4">
                <FilterPanel initialFilters={filters} onFilter={setFilters} />
              </div>
            </aside>
            <div className="lg:w-3/4">
              <ListingsContent initialCars={cars} filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}