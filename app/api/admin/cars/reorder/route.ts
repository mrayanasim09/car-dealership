import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { authManager } from '@/lib/auth-utils'
import { csrf } from '@/lib/security/csrf'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'

// Schema for reorder request
const reorderSchema = z.object({
  carOrders: z.array(z.object({
    id: z.string().min(1, 'Car ID is required'),
    displayOrder: z.number().int().min(0, 'Display order must be non-negative')
  })).min(1, 'At least one car order is required')
})

type ReorderInput = z.infer<typeof reorderSchema>

const guard = createRateLimitMiddleware(rateLimiters.api)

// PUT - Reorder cars
export async function PUT(request: NextRequest) {
  try {
    const user = await authManager.requireAdmin()
    const blocked = await guard(request)
    if (blocked) return blocked

    // Verify CSRF token
    const csrfToken = request.headers.get('x-csrf-token')
    if (!csrfToken || !csrf.verify(csrfToken)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }

    const body = await request.json()
    const { carOrders } = reorderSchema.parse(body)

    // Validate that all car IDs exist and user has permission to update them
    const carIds = carOrders.map(order => order.id)
    const { data: existingCars, error: fetchError } = await supabaseAdmin
      .from('cars')
      .select('id')
      .in('id', carIds)

    if (fetchError) {
      console.error('Error fetching cars for reorder:', fetchError)
      return NextResponse.json({ error: 'Failed to validate cars' }, { status: 500 })
    }

    if (existingCars.length !== carIds.length) {
      return NextResponse.json({ error: 'One or more cars not found' }, { status: 404 })
    }

    // Update display_order for each car
    const updatePromises = carOrders.map(carOrder => 
      supabaseAdmin
        .from('cars')
        .update({ display_order: carOrder.displayOrder })
        .eq('id', carOrder.id)
    )

    const results = await Promise.all(updatePromises)
    
    // Check for any errors
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Error updating car orders:', errors)
      return NextResponse.json({ error: 'Failed to update some car orders' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully updated order for ${carOrders.length} cars` 
    })

  } catch (error: unknown) {
    console.error('PUT reorder error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Authentication required')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (errorMessage.includes('Insufficient permissions')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    if (errorMessage.includes('Invalid input')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to reorder cars' },
      { status: 500 }
    )
  }
}
