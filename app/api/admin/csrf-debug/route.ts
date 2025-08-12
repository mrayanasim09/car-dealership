import { NextRequest, NextResponse } from 'next/server'
import { csrf } from '@/lib/security/csrf'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const headerRaw = request.headers.get('x-csrf-token') || ''
    const cookieRaw = request.cookies.get('csrf_token')?.value || ''
    const ok = csrf.verify(request)
    return NextResponse.json({
      ok,
      headerRaw,
      cookieRaw,
      same: Boolean(headerRaw) && Boolean(cookieRaw) && headerRaw === cookieRaw,
    })
  } catch {
    return NextResponse.json({ error: 'debug failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}


