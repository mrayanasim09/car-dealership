// app/car/[id]/page.tsx

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CarDetails } from '@/components/car-details'
import { CarImageCarousel } from '@/components/car-image-carousel'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { getCarById } from '@/lib/firebase/server'
import type { Car } from '@/lib/types'

interface CarPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const car = await getCarById(params.id)
  
  if (!car) {
    return {
      title: 'Car Not Found - AM Tycoons Inc',
      description: 'The requested vehicle could not be found.',
    }
  }

  return {
    title: `${car.title} - AM Tycoons Inc`,
    description: `${car.year} ${car.make} ${car.model} for sale at AM Tycoons Inc. ${car.mileage.toLocaleString()} miles, located in ${car.location}. Contact us for more information.`,
    keywords: `${car.make}, ${car.model}, ${car.year}, used car, pre-owned vehicle, ${car.location}, AM Tycoons Inc`,
    openGraph: {
      title: `${car.title} - AM Tycoons Inc`,
      description: `${car.year} ${car.make} ${car.model} for sale at AM Tycoons Inc. ${car.mileage.toLocaleString()} miles, located in ${car.location}.`,
      images: car.images && car.images.length > 0 ? car.images : ['/AMTycons_logo_transparent.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${car.title} - AM Tycoons Inc`,
      description: `${car.year} ${car.make} ${car.model} for sale at AM Tycoons Inc.`,
      images: car.images && car.images.length > 0 ? [car.images[0]] : ['/AMTycons_logo_transparent.png'],
    },
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const car = await getCarById(params.id)

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/inventory" className="hover:text-white transition-colors">Inventory</a></li>
            <li>/</li>
            <li className="text-white">{car.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Images */}
          <div className="space-y-4">
            <CarImageCarousel images={car.images} carTitle={car.title} />
          </div>

          {/* Car Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{car.title}</h1>
              <p className="text-2xl font-bold text-red-500 mb-4">${car.price.toLocaleString()}</p>
              <p className="text-gray-300 mb-6">{car.location}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400">Year</div>
                <div className="text-lg font-semibold text-white">{car.year}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400">Mileage</div>
                <div className="text-lg font-semibold text-white">{car.mileage.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400">Make</div>
                <div className="text-lg font-semibold text-white">{car.make}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-400">Model</div>
                <div className="text-lg font-semibold text-white">{car.model}</div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Contact Us About This Vehicle</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Call +1 424-303-0386</div>
                    <div className="text-sm text-gray-400">Primary Contact</div>
                  </div>
                  <a 
                    href="tel:+14243030386" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Call Now
                  </a>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Call +1 310-350-7709</div>
                    <div className="text-sm text-gray-400">Secondary Contact</div>
                  </div>
                  <a 
                    href="tel:+13103507709" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Call Now
                  </a>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Call +1 310-972-0341</div>
                    <div className="text-sm text-gray-400">Sales Team</div>
                  </div>
                  <a 
                    href="tel:+13109720341" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Call Now
                  </a>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Call +1 310-904-8377</div>
                    <div className="text-sm text-gray-400">Customer Service</div>
                  </div>
                  <a 
                    href="tel:+13109048377" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>
              
              {/* WhatsApp Contact */}
              <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">WhatsApp Contact</h4>
                <p className="text-gray-300 text-sm mb-3">Get quick responses via WhatsApp</p>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href={`https://wa.me/14243030386?text=Hi! I'm interested in the ${car.title} (${car.year} ${car.make} ${car.model}). Can you provide more information?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    WhatsApp 424
                  </a>
                  <a 
                    href={`https://wa.me/13103507709?text=Hi! I'm interested in the ${car.title} (${car.year} ${car.make} ${car.model}). Can you provide more information?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    WhatsApp 310
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Car Information */}
        <div className="mt-12">
          <CarDetails car={car} />
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}