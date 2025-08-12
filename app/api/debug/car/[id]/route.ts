import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabasePublic
      .from('cars')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      rawData: data,
      fields: {
        description: data.description,
        contact: data.contact,
        exterior_color: data.exterior_color,
        interior_color: data.interior_color,
        drive_type: data.drive_type,
        fuel_type: data.fuel_type,
        features: data.features,
      }
    })
  } catch (error) {
    console.error('Debug car error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
