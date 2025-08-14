// app/car/[id]/page.tsx

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CarDetails } from '@/components/car-details'
import type { Car } from '@/lib/types'
import { CarImageCarousel } from '@/components/car-image-carousel'

import { FloatingCompareButton } from '@/components/floating-compare-button'
import { supabasePublic } from '@/lib/supabase/client'
import Script from 'next/script'
import { headers } from 'next/headers'

interface CarPageProps {
  params: {
    id: string
  }
}

// Escape JSON-LD to avoid XSS/script breakouts
function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/<\/script/gi, '<\\/script')
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { data } = await supabasePublic.from('cars').select('*').eq('id', params.id).single()
  const car = mapDbCarToCar(data)
  
  if (!car) {
    return {
      title: 'Car Not Found - AM Tycoons Inc',
      description: 'The requested vehicle could not be found.',
    }
  }

  return {
    title: `${car.title} - AM Tycoons Inc`,
    description: `${car.year} ${car.make} ${car.model} for sale at AM Tycoons Inc. ${Number(car.mileage ?? 0).toLocaleString()} miles, located in ${car.location}. Contact us for more information.`,
    keywords: `${car.make}, ${car.model}, ${car.year}, used car, pre-owned vehicle, ${car.location}, AM Tycoons Inc`,
    alternates: { canonical: `/car/${params.id}` },
    openGraph: {
      title: `${car.title} - AM Tycoons Inc`,
      description: `${car.year} ${car.make} ${car.model} for sale at AM Tycoons Inc. ${car.mileage.toLocaleString()} miles, located in ${car.location}.`,
      images: car.images && car.images.length > 0 ? car.images : ['https://amtycoonsinc.com/optimized/am-tycoons-logo.png?v=4'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${car.title} - AM Tycoons Inc`,
      description: `${car.year} ${car.make} ${car.model} for sale at AM Tycoons Inc.`,
      images: car.images && car.images.length > 0 ? [car.images[0]] : ['https://amtycoonsinc.com/optimized/am-tycoons-logo.png?v=4'],
    },
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const nonce = headers().get('x-nonce') || undefined
  const { data } = await supabasePublic.from('cars').select('*').eq('id', params.id).single()
  const car = mapDbCarToCar(data)

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Script
          id="car-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': ['Product', 'Vehicle'],
              name: car.title,
              brand: car.make,
              model: car.model,
              vehicleModelDate: String(car.year),
              mileageFromOdometer: car.mileage ? { '@type': 'QuantitativeValue', value: car.mileage, unitCode: 'SMI' } : undefined,
              vehicleIdentificationNumber: car.vin || undefined,
              vehicleEngine: car.engine || undefined,
              color: car.exteriorColor || undefined,
              vehicleTransmission: car.transmission || undefined,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: car.price,
                availability: 'https://schema.org/InStock',
                url: `https://amtycoonsinc.com/car/${car.id}`,
                itemCondition: 'https://schema.org/UsedCondition',
              },
              image: Array.isArray(car.images) ? car.images : [],
              description: car.description,
              sku: car.id,
            }),
          }}
        />
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/inventory" className="hover:text-foreground transition-colors">Inventory</Link></li>
            <li>/</li>
            <li className="text-foreground">{car.title}</li>
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{car.title}</h1>
              <p className="text-2xl font-bold text-primary mb-4">${car.price.toLocaleString()}</p>
              <p className="text-muted-foreground mb-6">{car.location}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="text-sm text-muted-foreground">Year</div>
                <div className="text-lg font-semibold text-foreground">{car.year}</div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="text-sm text-muted-foreground">Mileage</div>
                <div className="text-lg font-semibold text-foreground">{Number(car.mileage ?? 0).toLocaleString()}</div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="text-sm text-muted-foreground">Make</div>
                <div className="text-lg font-semibold text-foreground">{car.make}</div>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border">
                <div className="text-sm text-muted-foreground">Model</div>
                <div className="text-lg font-semibold text-foreground">{car.model}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Car Information */}
        <div className="mt-10">
          <CarDetails car={car} />
        </div>
      </main>
      
      <Footer />
      <FloatingCompareButton />
    </div>
  )
}

type DbCar = {
  id: string
  title?: unknown
  make?: unknown
  model?: unknown
  year?: unknown
  mileage?: unknown
  price?: unknown
  description?: unknown
  location?: unknown
  vin?: unknown
  engine?: unknown
  transmission?: unknown
  exterior_color?: unknown
  interior_color?: unknown
  drive_type?: unknown
  fuel_type?: unknown
  features?: unknown
  documents?: unknown
  images?: unknown
  contact?: unknown
  rating?: unknown
  reviews?: unknown
  approved?: unknown
  listed_at?: unknown
  created_at?: unknown
  is_featured?: unknown
  is_inventory?: unknown
  isFeatured?: unknown
  isInventory?: unknown
}

function mapDbCarToCar(db: DbCar | null): Car | null {
  if (!db) return null
  return {
    id: String(db.id),
    title: String(db.title ?? ''),
    make: String(db.make ?? ''),
    model: String(db.model ?? ''),
    year: Number(db.year ?? 0),
    mileage: Number(db.mileage ?? 0),
    price: Number(db.price ?? 0),
    description: String(db.description ?? ''),
    location: String(db.location ?? ''),
    vin: db.vin ? String(db.vin) : undefined,
    engine: db.engine ? String(db.engine) : undefined,
    transmission: db.transmission ? String(db.transmission) : undefined,
    exteriorColor: db.exterior_color ? String(db.exterior_color) : undefined,
    interiorColor: db.interior_color ? String(db.interior_color) : undefined,
    driveType: db.drive_type ? String(db.drive_type) : undefined,
    fuelType: db.fuel_type ? String(db.fuel_type) : undefined,
    features: Array.isArray(db.features) ? (db.features as unknown[]).map(String) : [],
    documents: Array.isArray(db.documents)
      ? (db.documents as Array<Record<string, unknown>>).map(d => ({ name: String(d.name ?? ''), url: String(d.url ?? '') }))
      : [],
    images: Array.isArray(db.images) ? (db.images as unknown[]).map(String) : [],
    contact: typeof db.contact === 'object' && db.contact !== null
      ? { phone: String((db.contact as Record<string, unknown>).phone ?? ''), whatsapp: String((db.contact as Record<string, unknown>).whatsapp ?? '') }
      : { phone: '', whatsapp: '' },
    rating: Number(db.rating ?? 0),
    reviews: Array.isArray(db.reviews) ? (db.reviews as Array<Record<string, unknown>>).map(r => ({
      id: r.id ? String(r.id as string) : undefined,
      carId: r.carId ? String(r.carId as string) : undefined,
      name: String(r.name ?? ''),
      comment: String(r.comment ?? ''),
      stars: Number(r.stars ?? 0),
      createdAt: r.createdAt ? new Date(r.createdAt as string) : new Date(),
    })) : [],
    approved: Boolean(db.approved),
    listedAt: db.listed_at ? new Date(db.listed_at as string) : new Date(),
    createdAt: db.created_at ? new Date(db.created_at as string) : undefined,
    isFeatured: 'is_featured' in db ? Boolean(db.is_featured) : Boolean(db.isFeatured),
    isInventory: 'is_inventory' in db ? Boolean(db.is_inventory) : Boolean(db.isInventory),
  }
}