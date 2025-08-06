export interface Car {
  id: string
  title: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  description: string
  location: string
  vin?: string
  engine?: string
  transmission?: string
  exteriorColor?: string
  interiorColor?: string
  driveType?: string
  fuelType?: string
  features?: string[]
  documents?: { name: string; url: string }[]
  images: string[]
  contact: {
    phone: string
    whatsapp: string
  }
  rating: number
  reviews: Review[]
  approved: boolean
  listedAt: Date
  isFeatured?: boolean
  isInventory?: boolean
}

export interface Review {
  id?: string
  carId?: string
  name: string
  comment: string
  stars: number
  createdAt: any
}

