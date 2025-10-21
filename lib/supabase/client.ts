import { createClient } from '@supabase/supabase-js'

// Public (anon) Supabase client safe for client and server components
// IMPORTANT: Do not import any service-role keys here

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !anonKey) {
  // Soft warning to aid local setup only; avoid noisy logs in production
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[supabase/client] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

export const supabasePublic = createClient(supabaseUrl || 'https://mock.supabase.co', anonKey || 'mock-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})


