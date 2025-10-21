import type { Car } from "./types"

export const mockCar: Car = {
  id: '1',
  title: '2021 Honda Civic',
  make: 'Honda',
  model: 'Civic',
  year: 2021,
  mileage: 45000,
  price: 25000,
  description: 'A reliable sedan in excellent condition',
  location: 'Norwalk, CA',
  vin: '1HGBH41JXMN109186',
  engine: '2.5L 4-Cylinder',
  transmission: 'Automatic',
  exteriorColor: 'Silver',
  interiorColor: 'Black',
  driveType: 'FWD',
  fuelType: 'Gasoline',
  features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
  documents: [],
  images: ['/test-image.jpg'],
  contact: {
    phone: '555-0123',
    whatsapp: '555-0123'
  },
  rating: 4.5,
  reviews: [],
  approved: true,
  listedAt: new Date('2024-01-01T00:00:00Z'),
  createdAt: new Date('2024-01-01T00:00:00Z'),
  isFeatured: false,
  isInventory: true
}

export const mockCars: Car[] = [mockCar]

