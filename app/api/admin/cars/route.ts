import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authManager } from '@/lib/auth-utils'
import { addCar, updateCar, deleteCar, getAllCars } from '@/lib/firebase'

// Input validation schemas with stricter validation
const carSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').trim(),
  make: z.string().min(1, 'Make is required').max(50).trim(),
  model: z.string().min(1, 'Model is required').max(50).trim(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(1, 'Location is required').max(100).trim(),
  description: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  driveType: z.string().optional(),
  fuelType: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  vin: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  approved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isInventory: z.boolean().optional()
})

const updateCarSchema = carSchema.partial().extend({
  id: z.string().min(1, 'Car ID is required')
})

// Enhanced rate limiting with IP tracking
const operationAttempts = new Map<string, { count: number; resetTime: number; blocked: boolean }>()

function checkOperationRateLimit(ip: string, operation: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxAttempts = 10
  const blockDuration = 5 * 60 * 1000 // 5 minutes

  const key = `${ip}:${operation}`
  const record = operationAttempts.get(key)
  
  if (!record || now > record.resetTime) {
    operationAttempts.set(key, {
      count: 1,
      resetTime: now + windowMs,
      blocked: false
    })
    return true
  }

  // Check if IP is blocked
  if (record.blocked && now < record.resetTime + blockDuration) {
    return false
  }

  if (record.count >= maxAttempts) {
    record.blocked = true
    record.resetTime = now + blockDuration
    return false
  }

  record.count++
  return true
}

// GET - List cars (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await authManager.requireAdmin()
    
    // Check rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkOperationRateLimit(ip, 'list_cars')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const cars = await getAllCars()
    
    // Filter sensitive data for non-super admins
    const filteredCars = user.role === 'admin' 
      ? cars.map(car => ({
          ...(car as unknown as Record<string, unknown>),
          // Remove sensitive fields for regular admins
          internalNotes: undefined,
          cost: undefined
        }))
      : cars

    return NextResponse.json({ cars: filteredCars })

  } catch (error: unknown) {
    console.error('GET cars error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    )
  }
}

// POST - Add new car
export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const user = await authManager.requireAdmin()
    
    // Check rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkOperationRateLimit(ip, 'add_car')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = carSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid car data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const carData = validationResult.data

    // Add audit trail and required fields - FIXED: Set approved and isInventory to true by default
    const carWithAudit = {
      ...carData,
      description: carData.description || '',
      images: carData.images || [],
      createdBy: user.id,
      createdAt: new Date(),
      approved: true, // FIXED: New cars are approved by default
      isInventory: true, // FIXED: New cars are in inventory by default
      isFeatured: carData.isFeatured || false,
      contact: {
        phone: carData.phone || '',
        whatsapp: carData.whatsapp || ''
      },
      rating: 0,
      reviews: [],
      listedAt: new Date(),
      views: 0,
      likes: 0
    }

    const carId = await addCar(carWithAudit)
    
    if (!carId) {
      return NextResponse.json(
        { error: 'Failed to add car' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, carId },
      { status: 201 }
    )

  } catch (error: unknown) {
    console.error('POST car error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to add car' },
      { status: 500 }
    )
  }
}

// PUT - Update car
export async function PUT(request: NextRequest) {
  try {
    // Check authentication and permissions
    await authManager.requireAdmin()
    
    // Check rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkOperationRateLimit(ip, 'update_car')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = updateCarSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid car data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { id, ...updateData } = validationResult.data

    // Add audit trail
    const updateWithAudit = {
      ...updateData,
      updatedAt: new Date()
    }

    try {
      const updatedCar = await updateCar(id, updateWithAudit)
      return NextResponse.json({ success: true, car: updatedCar })
    } catch (error) {
      console.error('Error updating car:', error)
      return NextResponse.json(
        { error: 'Failed to update car' },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('PUT car error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 }
    )
  }
}

// DELETE - Delete car
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and permissions
    await authManager.requireAdmin()
    
    // Check rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkOperationRateLimit(ip, 'delete_car')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const carId = searchParams.get('id')

    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      )
    }

    try {
      await deleteCar(carId)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting car:', error)
      return NextResponse.json(
        { error: 'Failed to delete car' },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('DELETE car error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    )
  }
}
