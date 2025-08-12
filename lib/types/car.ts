export interface CarImage {
  url: string;
  publicId?: string;
  main?: boolean;
}

export interface CarFeature {
  name: string;
  value: string;
  icon?: string;
}

export interface CarSpecs {
  engine?: string;
  transmission?: string;
  fuelType?: string;
  mileage: number;
  year: number;
  color?: string;
  doors?: number;
  seats?: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  specs?: CarSpecs;
  features: CarFeature[];
  images: CarImage[];
  status?: 'available' | 'sold' | 'reserved' | 'maintenance';
  condition?: 'new' | 'used' | 'certified';
  featured?: boolean;
  trending?: boolean;
  approved?: boolean;
  isFeatured?: boolean;
  isInventory?: boolean;
  exteriorColor?: string;
  interiorColor?: string;
  mileage: number;
  year: number;
  location?: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  driveType?: string;
  fuelType?: string;
  documents?: Array<{ name: string; url: string }> | string;
  contact?: {
    phone: string;
    whatsapp?: string;
  };
  rating?: number;
  reviews?: Record<string, unknown>[];
  listedAt?: Date;
  views?: number;
  likes?: number;
  slug?: string;
  searchTerms?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
