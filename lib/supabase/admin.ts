import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client using the service role key
// WARNING: Never import this module in client components

let cachedClient: ReturnType<typeof createClient> | null = null

function instantiate(): ReturnType<typeof createClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  // If Supabase is not configured, return a mock client to prevent build errors
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('[supabase/admin] Supabase not configured - using mock client')
    return createClient('https://mock.supabase.co', 'mock-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function getSupabaseAdmin(): ReturnType<typeof createClient> {
  if (!cachedClient) {
    cachedClient = instantiate()
  }
  return cachedClient
}

// Backwards compatibility: a lazy proxy that only instantiates when used
export const supabaseAdmin = new Proxy({} as unknown as ReturnType<typeof createClient>, {
  get(_target, prop, receiver) {
    if (!cachedClient) {
      try {
        cachedClient = instantiate()
      } catch (e) {
        // In non-production builds, avoid crashing import time usage; throw when actually used
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[supabase/admin] Accessed before configuration. Ensure env vars are set at runtime.')
        }
        // Re-throw so API routes surface the error when called
        throw e
      }
    }
    return Reflect.get(cachedClient as unknown as Record<string, unknown>, prop, receiver as unknown as object)
  },
})


