import { createClient } from "@supabase/supabase-js"

/* ========================================
   SINGLETON SUPABASE CLIENT
   - prevents multiple instances
   - faster dashboard
   - stable auth
   - production safe
======================================== */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let client: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        fetch: (...args) => fetch(...args)
      }
    })
  }

  return client
}

/* backwards compatible export */
export const supabase = getSupabase()
