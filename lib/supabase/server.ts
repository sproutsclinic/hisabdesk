ï»¿import { createClient } from '@supabase/supabase-js'

/**
 * =========================================================
 * HisabDesk â€” Supabase Server Client (SERVICE ROLE)
 * Used ONLY inside:
 * - API routes
 * - Server Components
 * - Jobs / Automation
 * NEVER expose to browser.
 * =========================================================
 */

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

  return createClient(url, key, {
    auth: { persistSession: false }
  })
}
