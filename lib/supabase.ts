import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

/* ========================================
   SINGLETON + TYPED SUPABASE CLIENT
   - typed DB (autocomplete + safety)
   - prevents multiple instances
   - faster dashboard
   - stable auth
   - production safe
======================================== */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let client: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!client) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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
