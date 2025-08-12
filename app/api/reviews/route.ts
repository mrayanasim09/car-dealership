import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createRateLimitMiddleware, rateLimiters } from '@/lib/security/rate-limiter'

const guard = createRateLimitMiddleware(rateLimiters.api)

const createSchema = z.object({
  carId: z.string().min(1, 'carId is required'),
  name: z.string().min(1, 'name is required').max(80),
  comment: z.string().min(1, 'comment is required').max(1000),
  stars: z.number().int().min(1).max(5)
})

export async function POST(request: NextRequest) {
  try {
    const blocked = await guard(request)
    if (blocked) return blocked

    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { carId, name, comment, stars } = parsed.data

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        car_id: carId,
        name: name.trim(),
        comment: comment.trim(),
        stars,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to submit review', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, review: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error', details: (err as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const carId = searchParams.get('carId')

    let query = supabaseAdmin.from('reviews').select('*').order('created_at', { ascending: false })
    if (carId) {
      query = query.eq('car_id', carId)
    }
    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ reviews: data || [] })
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error', details: (err as Error).message },
      { status: 500 }
    )
  }
}


