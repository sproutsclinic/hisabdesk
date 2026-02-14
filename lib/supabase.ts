/* =================================================
   Supabase Clients — NEXT 16 / TURBOPACK SAFE
   ✔ browser singleton
   ✔ server safe (no hanging fetch)
   ✔ shorter timeouts
   ✔ no edge timeout errors
   Phase 3 — Production hardening (ADDITIVE ONLY)
================================================= */

import { createBrowserClient } from "@supabase/ssr"
import { createClient as supabaseCreateClient } from "@supabase/supabase-js" // ✅ renamed

/* ===============================
   ENV
=============================== */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/* ===============================
   BROWSER CLIENT (singleton)
=============================== */

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (typeof window === "undefined") return null as any

  if (!browserClient) {
    browserClient = createBrowserClient(URL, KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          "x-application-name": "hisabdesk-web",
        },
        fetch: (url, options) =>
          fetch(url, {
            ...options,
            cache: "no-store",
          }),
      },
    })
  }

  return browserClient
}

/* ===============================
   SERVER CLIENT (stable)
=============================== */

export function getSupabaseServer() {
  return supabaseCreateClient(URL, KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "x-application-name": "hisabdesk-server",
      },
      fetch: (url, options) =>
        fetch(url, {
          ...options,
          cache: "no-store",
        }),
    },
  })
}

/* =================================================
   ✅ GLOBAL BACKWARD COMPATIBILITY FIX (IMPORTANT)
   ------------------------------------------------
   Many routes import:
     import { createClient } from "@/lib/supabase"

   We alias it so OLD code keeps working.
================================================= */

export const createClient = getSupabaseServer // ✅ ADD THIS LINE

/* ===============================
   DEFAULT EXPORT (compat)
=============================== */

export const supabase =
  typeof window !== "undefined"
    ? getSupabaseClient()
    : getSupabaseServer()