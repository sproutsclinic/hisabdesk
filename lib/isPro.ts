import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/* ========================================
   CHECK PRO STATUS
   Reads profiles.is_pro (set by webhook)
======================================== */

export async function isProUser(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", userId)
    .single()

  return data?.is_pro === true
}
