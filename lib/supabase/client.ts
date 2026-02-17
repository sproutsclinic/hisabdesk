ï»¿import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * =========================================================
 * Supabase BROWSER Client
 * ---------------------------------------------------------
 * Safe for client-side usage.
 * =========================================================
 */

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  if (!anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return createSupabaseClient(url, anon)
}
