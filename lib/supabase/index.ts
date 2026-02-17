// ==========================================================
// TEMP COMPATIBILITY LAYER (HARDENING PHASE ONLY)
// This file will be deleted after migration is complete.
// DO NOT ADD NEW USAGE.
// ==========================================================

export { getSupabaseAdmin } from "./gateway"

// Client-safe wrapper (for legacy UI code)
export const getSupabaseClient = () => {
  throw new Error(
    "getSupabaseClient() is deprecated. Use API layer instead."
  )
}

// Server wrapper (legacy)
export const getSupabaseServer = () => {
  return getSupabaseAdmin()
}

// Direct client export BLOCKED intentionally
export const supabase = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "Direct Supabase usage is forbidden. Use gateway/services."
      )
    },
  }
)