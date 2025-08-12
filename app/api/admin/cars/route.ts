import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { authManager } from '@/lib/auth-utils'
import { csrf } from '@/lib/security/csrf'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'

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
  documents: z.array(z.object({ name: z.string().max(200), url: z.string().url().max(1000) })).optional(),
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

// type CarInput = z.infer<typeof carSchema>
type CarUpdateInput = z.infer<typeof updateCarSchema>

const guard = createRateLimitMiddleware(rateLimiters.api)

// GET - List cars (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await authManager.requireAdmin()
    const blocked = await guard(request)
    if (blocked) return blocked

    const { data: carsData, error } = await supabaseAdmin
      .from('cars')
      .select('*')
      .order('listed_at', { ascending: false })
    const cars = (error || !carsData) ? [] : carsData
    
    // Filter sensitive data for non-super admins
    const filteredCars = user.role !== 'super_admin' 
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
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const user = await authManager.requireAdmin()
    if (!user.permissions?.canCreateCars && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const blocked = await guard(request)
    if (blocked) return blocked

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

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('cars')
      .insert({
        title: carWithAudit.title,
        make: carWithAudit.make,
        model: carWithAudit.model,
        year: carWithAudit.year,
        mileage: carWithAudit.mileage,
        price: carWithAudit.price,
        location: carWithAudit.location,
        description: carWithAudit.description,
        vin: carWithAudit.vin,
        engine: carWithAudit.engine,
        transmission: carWithAudit.transmission,
        exterior_color: carWithAudit.exteriorColor,
        interior_color: carWithAudit.interiorColor,
        drive_type: carWithAudit.driveType,
        fuel_type: carWithAudit.fuelType,
        features: carWithAudit.features || [],
        images: carWithAudit.images || [],
        documents: [],
        contact: carWithAudit.contact,
        approved: carWithAudit.approved,
        is_featured: carWithAudit.isFeatured,
        is_inventory: carWithAudit.isInventory,
        rating: carWithAudit.rating,
        reviews: carWithAudit.reviews,
        listed_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        created_by: user.id,
      })
      .select('id')
      .limit(1)

    if (insErr || !inserted || inserted.length === 0) {
      return NextResponse.json({ error: 'Failed to add car' }, { status: 500 })
    }

    return NextResponse.json({ success: true, carId: inserted[0].id }, { status: 201 })

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
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const user = await authManager.requireAdmin()
    if (!user.permissions?.canEditCars && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const blocked = await guard(request)
    if (blocked) return blocked

    // Parse and validate request body
    const body = await request.json()
    
    const validationResult = updateCarSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid car data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { id, ...updateData } = validationResult.data as CarUpdateInput

    // Add audit trail
    // const updateWithAudit = { ...updateData, updatedAt: new Date() }

    try {
      // Build update object only with defined values
      const updateObject: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      }

      // Only add fields that are defined
      if (updateData.title !== undefined) updateObject.title = updateData.title
      if (updateData.make !== undefined) updateObject.make = updateData.make
      if (updateData.model !== undefined) updateObject.model = updateData.model
      if (updateData.year !== undefined) updateObject.year = updateData.year
      if (updateData.mileage !== undefined) updateObject.mileage = updateData.mileage
      if (updateData.price !== undefined) updateObject.price = updateData.price
      if (updateData.location !== undefined) updateObject.location = updateData.location
      if (updateData.description !== undefined) updateObject.description = updateData.description
      if (updateData.vin !== undefined) updateObject.vin = updateData.vin
      if (updateData.engine !== undefined) updateObject.engine = updateData.engine
      if (updateData.transmission !== undefined) updateObject.transmission = updateData.transmission
      if (updateData.exteriorColor !== undefined) updateObject.exterior_color = updateData.exteriorColor
      if (updateData.interiorColor !== undefined) updateObject.interior_color = updateData.interiorColor
      if (updateData.driveType !== undefined) updateObject.drive_type = updateData.driveType
      if (updateData.fuelType !== undefined) updateObject.fuel_type = updateData.fuelType
      if (updateData.features !== undefined) updateObject.features = updateData.features
      if (updateData.images !== undefined) updateObject.images = updateData.images
      if (updateData.documents !== undefined) updateObject.documents = updateData.documents
      if (updateData.isFeatured !== undefined) updateObject.is_featured = updateData.isFeatured
      if (updateData.isInventory !== undefined) updateObject.is_inventory = updateData.isInventory

      // Handle contact object
      if (updateData.phone !== undefined || updateData.whatsapp !== undefined) {
        updateObject.contact = {
          phone: updateData.phone || '',
          whatsapp: updateData.whatsapp || ''
        }
      }

      console.log('Updating car with data:', updateObject)

      const { data: updated, error: upErr } = await supabaseAdmin
        .from('cars')
        .update(updateObject)
        .eq('id', id)
        .select('id')
      
      if (upErr) {
        console.error('Supabase update error:', upErr)
        throw upErr
      }
      if (!updated || updated.length === 0) {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, id: updated[0].id })
    } catch (error) {
      console.error('Error updating car:', error)
      const err = error as unknown as { message?: string; code?: string; details?: string; hint?: string }
      return NextResponse.json(
        { 
          error: 'Failed to update car',
          details: err?.message || err?.code || err?.details || err?.hint || 'Unknown error'
        },
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
    if (!csrf.verify(request)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
    const user = await authManager.requireAdmin()
    if (!user.permissions?.canDeleteCars && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const blocked = await guard(request)
    if (blocked) return blocked

    const { searchParams } = new URL(request.url)
    const carId = searchParams.get('id')

    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      )
    }

    try {
      const { error: delErr } = await supabaseAdmin
        .from('cars')
        .delete()
        .eq('id', carId)
      if (delErr) throw delErr
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
