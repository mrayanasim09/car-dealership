import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[CSP-Report]', JSON.stringify(body))
    }
  } catch {}
  return NextResponse.json({ ok: true })
}


