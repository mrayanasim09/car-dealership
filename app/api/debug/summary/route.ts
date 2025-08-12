import { NextRequest, NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase/client'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { createStore } from '@/lib/security/session-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const startedAt = Date.now()
  try {
    // Supabase counts
    const [totalQ, approvedQ, inventoryQ, publicQ, sampleQ] = await Promise.all([
      supabasePublic.from('cars').select('*', { count: 'exact', head: true }),
      supabasePublic.from('cars').select('*', { count: 'exact', head: true }).eq('approved', true),
      supabasePublic.from('cars').select('*', { count: 'exact', head: true }).eq('is_inventory', true),
      supabasePublic.from('cars').select('*', { count: 'exact', head: true }).eq('approved', true).eq('is_inventory', true),
      supabasePublic.from('cars').select('id,title,approved,is_inventory,listed_at').order('listed_at', { ascending: false }).limit(10),
    ])

    const counts = {
      totalCars: totalQ.count || 0,
      approvedCars: approvedQ.count || 0,
      inventoryCars: inventoryQ.count || 0,
      publicCars: publicQ.count || 0,
    }

    // Rate limiter status for this requester (API limiter)
    const rl = await rateLimiters.api.getStatus(request)

    // Session store backend info
    const useRedis = process.env.USE_REDIS === '1' && !!process.env.REDIS_URL
    const store = await createStore()
    let sessionKeys = 0
    try {
      const keys = await store.keys('session:')
      sessionKeys = keys.length
    } catch {}

    // Config presence (non-sensitive)
    const config = {
      supabaseUrlSet: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnonKeySet: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      vercelAnalyticsSet: Boolean(process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID),
      cspReportUriSet: Boolean(process.env.CSP_REPORT_URI),
      blobTokenOnServer: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      useRedis,
    }

    const ms = Date.now() - startedAt
    return NextResponse.json(
      {
        ok: true,
        ms,
        counts,
        samples: sampleQ.data || [],
        rateLimit: rl,
        sessionStore: {
          backend: useRedis ? 'redis' : 'memory',
          sessionKeys,
        },
        config,
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    const ms = Date.now() - startedAt
    return NextResponse.json(
      { ok: false, error: (error as Error).message, ms },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}


