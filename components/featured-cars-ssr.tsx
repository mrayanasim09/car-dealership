import { supabasePublic } from '@/lib/supabase/client'
import { CarCard } from '@/components/car-card'
import type { Car } from '@/lib/types'

export async function FeaturedCarsSSR() {
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
    is_featured?: boolean
    is_inventory?: boolean
  }

  const { data, error } = await supabasePublic
    .from('cars')
    .select('*')
    .eq('approved', true)
    .eq('is_featured', true)
    .order('listed_at', { ascending: false })
    .limit(6)

  const cars: Car[] = (error || !data)
    ? []
    : (data as CarRow[]).map(r => ({
        id: r.id,
        title: r.title,
        make: r.make,
        model: r.model,
        year: r.year,
        mileage: r.mileage,
        price: r.price,
        location: r.location,
        images: r.images,
        approved: true,
        isFeatured: Boolean(r.is_featured),
        isInventory: Boolean(r.is_inventory),
        description: '',
        contact: { phone: '', whatsapp: '' },
        rating: 0,
        reviews: [],
        listedAt: new Date(),
      }))

  return (
    <div className="container mx-auto px-4">
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 content-visibility-auto" role="list">
          {cars.map((car) => (
            <div key={car.id} role="listitem">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 md:py-12">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No featured vehicles available
          </h3>
          <p className="text-muted-foreground text-sm md:text-base">
            Check back soon for our latest featured vehicles.
          </p>
        </div>
      )}
    </div>
  )
}


