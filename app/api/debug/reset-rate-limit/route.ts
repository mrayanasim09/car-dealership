import { NextResponse } from 'next/server'

// Disabled in production for security
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
