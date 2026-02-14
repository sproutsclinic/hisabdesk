import { getSupabaseServer } from "@/lib/supabase"

/* ========================================
   CHECK PRO STATUS (SERVER SAFE)

   - request scoped client
   - no global singleton
   - no SSR crash
======================================== */

export async function isProUser(userId: string): Promise<boolean> {
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", userId)
    .single()

  if (error || !data) return false

  return data.is_pro === true
}
