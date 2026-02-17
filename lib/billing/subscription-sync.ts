ï»¿"use server"

/**
 * =========================================================
 * Subscription Sync Service (Razorpay ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ DB)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing Reliability Layer
 * =========================================================
 *
 * PURPOSE
 * Keep database subscription state 100% correct.
 *
 * Handles:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ activate Pro
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ extend expiry
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ cancel subscription
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ store subscription id
 *
 * WHY
 * ---------------------------------------------------------
 * Webhooks can grow complex.
 * NEVER write billing logic directly in webhook.
 *
 * Webhook ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ calls THIS service
 *
 * Single source of truth.
 *
 * =========================================================
 *
 * USAGE (inside webhook)
 *
 * await activatePro(userId, subscriptionId)
 * await cancelPro(userId)
 *
 * =========================================================
 *
 * SAFE
 * - server only
 * - service role only
 * =========================================================
 */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   HELPERS
========================================================= */

function addOneMonth(date?: string | null) {
  const d = date ? new Date(date) : new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString()
}

/* =========================================================
   ACTIVATE / EXTEND PRO
========================================================= */

export async function activatePro(
  userId: string,
  subscriptionId?: string
) {
  const supabase = getClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("pro_expires_at")
    .eq("id", userId)
    .single()

  const newExpiry = addOneMonth(
    profile?.pro_expires_at
  )

  await supabase
    .from("profiles")
    .update({
      is_pro: true,
      pro_since: new Date().toISOString(),
      pro_expires_at: newExpiry,
      razorpay_subscription_id:
        subscriptionId || null,
    })
    .eq("id", userId)
}

/* =========================================================
   CANCEL / DOWNGRADE
========================================================= */

export async function cancelPro(userId: string) {
  const supabase = getClient()

  await supabase
    .from("profiles")
    .update({
      is_pro: false,
      razorpay_subscription_id: null,
    })
    .eq("id", userId)
}

/* =========================================================
   FORCE SYNC (optional manual repair)
========================================================= */

export async function setExpiry(
  userId: string,
  dateISO: string
) {
  const supabase = getClient()

  await supabase
    .from("profiles")
    .update({
      is_pro: true,
      pro_expires_at: dateISO,
    })
    .eq("id", userId)
}
