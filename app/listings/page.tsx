import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ListingsContent } from "@/components/listings-content"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getAllCars } from "@/lib/firebase/server"
import { Metadata } from 'next'
import type { Car } from "@/lib/types"

// Optimize caching and performance - reduce revalidation for better performance
export const revalidate = 60 // 1 minute instead of 5 minutes
export const dynamic = 'force-dynamic' // Change to dynamic for real-time updates

export const metadata: Metadata = {
  title: 'Car Inventory - AM Tycoons Inc',
  description: 'Browse our complete selection of quality pre-owned vehicles at AM Tycoons Inc. Find your perfect car with our comprehensive inventory.',
  keywords: 'car inventory, pre-owned vehicles, used cars, AM Tycoons',
  openGraph: {
    title: 'Car Inventory - AM Tycoons Inc',
    description: 'Browse our complete selection of quality pre-owned vehicles',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function ListingsPage() {
  let cars: Car[] = []
  let error: string | null = null

  try {
    cars = await getAllCars()
    console.log(`✅ Loaded ${cars.length} cars from database`)
  } catch (err) {
    console.error('❌ Failed to load cars:', err)
    error = 'Failed to load inventory. Please try again later.'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Complete Inventory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our complete selection of quality pre-owned vehicles at AM Tycoons Inc.
          </p>
          {cars.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <ListingsContent initialCars={cars} />
        )}
      </div>
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}