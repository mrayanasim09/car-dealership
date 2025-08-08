// app/car/[id]/page.tsx

import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { CarImageCarousel } from "@/components/car-image-carousel"
import { ContactToBuy } from "@/components/contact-to-buy"
import { SimilarCars } from "@/components/similar-cars"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getAllCars, getCarById, isFirebaseAvailable } from "@/lib/firebase"
import type { Car } from "@/lib/types"

// ISR: Revalidate every 10 minutes
export const revalidate = 600

// Generate metadata for car pages
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    if (!isFirebaseAvailable()) {
      return {
        title: 'Vehicle Not Found - AM Tycoons Inc',
        description: 'The requested vehicle could not be found.',
      }
    }
    
    const car = await getCarById(params.id)
    
    if (!car) {
      return {
        title: 'Vehicle Not Found - AM Tycoons Inc',
        description: 'The requested vehicle could not be found.',
      }
    }

    const price = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format((car as any).price)

    return {
      title: `${(car as any).title} - ${price} | AM Tycoons Inc`,
      description: `${(car as any).year} ${(car as any).make} ${(car as any).model} for sale at ${price}. ${(car as any).mileage.toLocaleString()} miles. Located in ${(car as any).location}. Contact AM Tycoons Inc for details.`,
      keywords: `${(car as any).make}, ${(car as any).model}, ${(car as any).year}, used car, pre-owned vehicle, ${(car as any).location}, car dealership, AM Tycoons Inc`,
      openGraph: {
        title: `${(car as any).title} - ${price}`,
        description: `${(car as any).year} ${(car as any).make} ${(car as any).model} for sale at ${price}. ${(car as any).mileage.toLocaleString()} miles.`,
        type: 'website',
        url: `https://amtycoons.com/car/${(car as any).id}`,
        images: (car as any).images.length > 0 ? [
          {
            url: (car as any).images[0].startsWith('http') ? (car as any).images[0] : `https://amtycoons.com${(car as any).images[0]}`,
            width: 1200,
            height: 630,
            alt: (car as any).title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${(car as any).title} - ${price}`,
        description: `${(car as any).year} ${(car as any).make} ${(car as any).model} for sale at ${price}.`,
        images: (car as any).images.length > 0 ? [(car as any).images[0]] : [],
      },
      alternates: {
        canonical: `https://amtycoons.com/car/${(car as any).id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Vehicle Details - AM Tycoons Inc',
      description: 'View vehicle details at AM Tycoons Inc.',
    }
  }
}

// Generate static params for all cars
export async function generateStaticParams() {
  try {
    if (!isFirebaseAvailable()) {
      return []
    }
    
    const allCars = await getAllCars()
    const approvedCars = allCars.filter((car: any) => car.approved === true)
    
    return approvedCars.map((car: any) => ({
      id: car.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

interface CarPageProps {
  params: {
    id: string
  }
}

export default async function CarPage({ params }: CarPageProps) {
  let car: Car | null = null
  let allCars: Car[] = []

  try {
    if (isFirebaseAvailable()) {
      const [carData, allCarsData] = await Promise.all([
        getCarById(params.id),
        getAllCars(),
      ])
      
      if (!carData) {
        notFound()
      }
      
      car = carData
      allCars = allCarsData
    } else {
      notFound()
    }
  } catch {
    notFound()
  }

  if (!car) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: (car as any).title }
  ]

  // Generate structured data for the car
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: (car as any).title,
    brand: {
      '@type': 'Brand',
      name: (car as any).make
    },
    model: (car as any).model,
    vehicleModelDate: (car as any).year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: (car as any).mileage,
      unitCode: 'SMI' // Statute mile
    },
    color: (car as any).exteriorColor || 'Unknown',
    vehicleCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      price: (car as any).price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: 'AM Tycoons Inc',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '12440 Firestone Blvd, Suite 3025D',
          addressLocality: 'Norwalk',
          addressRegion: 'CA',
          postalCode: '90650',
          addressCountry: 'US'
        },
        telephone: '+1-424-303-0386'
      }
    },
    image: (car as any).images.length > 0 ? (car as any).images : [],
    description: (car as any).description || `${(car as any).year} ${(car as any).make} ${(car as any).model} for sale at AM Tycoons Inc.`,
    url: `https://amtycoons.com/car/${(car as any).id}`
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <CarImageCarousel images={(car as any).images} carTitle={(car as any).title} />
              <SimilarCars currentCar={car} cars={allCars} />
          </div>
          <div className="space-y-6">
              <ContactToBuy car={car} />
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}