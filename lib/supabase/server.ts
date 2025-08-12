// Deprecated: This module provided both public and admin clients.
// To avoid accidental client-side import of the service role client, use:
// - lib/supabase/client for public client (safe for client/server components)
// - lib/supabase/admin for service role (server-only)
export type DBRow<T extends Record<string, unknown>> = T & { id: string }


