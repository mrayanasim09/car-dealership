import { NextResponse } from 'next/server'

export async function GET() {
  const usingRedis = process.env.USE_REDIS === '1' && Boolean(process.env.REDIS_URL)
  const startedAt = Date.now()
  let ok = false
  let error: string | undefined
  let backend: 'memory' | 'redis' = 'memory'

  if (!usingRedis) {
    ok = true
  } else {
    backend = 'redis'
    // Prefer Upstash REST health check when credentials present
    const restUrl = process.env.UPSTASH_REDIS_REST_URL
    const restToken = process.env.UPSTASH_REDIS_REST_TOKEN
    if (restUrl && restToken) {
      try {
        const res = await fetch(`${restUrl}/PING`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${restToken}` },
          cache: 'no-store',
        })
        const raw = (await res.json().catch(() => ({} as unknown))) as { result?: string } | string
        const result = typeof raw === 'string' ? raw : raw?.result
        ok = res.ok && result === 'PONG'
      } catch (e) {
        error = e instanceof Error ? e.message : 'Upstash ping failed'
        ok = false
      }
    } else {
      // Redis configured but no REST creds; cannot check generically without the redis client
      ok = false
      error = 'Redis configured but UPSTASH_REDIS_REST_URL/TOKEN not set for REST health check'
    }
  }

  const ms = Date.now() - startedAt
  const maskedUrl = process.env.REDIS_URL ? process.env.REDIS_URL.replace(/:\/\/.+@/, '://****:****@') : undefined

  return NextResponse.json(
    {
      ok,
      usingRedis,
      backend,
      ms,
      error: ok ? undefined : error,
      redisUrl: usingRedis ? maskedUrl : undefined,
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}


