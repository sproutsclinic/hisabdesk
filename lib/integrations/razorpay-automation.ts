ï»¿/**
 * =========================================================
 * Razorpay Automation Service (Enterprise Service Layer)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase A
 * =========================================================
 *
 * PURPOSE
 * - Move ALL business logic out of webhook
 * - Reusable from:
 *    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Webhook
 *    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Admin actions
 *    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Cron jobs
 *    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Manual upgrades
 *    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Support tools
 *
 * SAFE
 * - Does NOT modify existing webhook
 * - Pure server service
 *
 * USAGE (later, optional)
 * import { activateProPlan, cancelProPlan } from "@/lib/integrations/razorpay-automation"
 *
 * await activateProPlan(userId)
 *
 * =========================================================
 */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   SUPABASE ADMIN CLIENT (service role only)
========================================================= */

function getAdminClient() {
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
   CORE: ACTIVATE / EXTEND PRO
========================================================= */

export async function activateProPlan(userId: string) {
  const supabase = getAdminClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("pro_expires_at")
    .eq("id", userId)
    .single()

  const newExpiry = addOneMonth(profile?.pro_expires_at)

  await supabase
    .from("profiles")
    .update({
      is_pro: true,
      pro_since: new Date().toISOString(),
      pro_expires_at: newExpiry,
    })
    .eq("id", userId)

  return newExpiry
}

/* =========================================================
   CORE: CANCEL PRO
========================================================= */

export async function cancelProPlan(userId: string) {
  const supabase = getAdminClient()

  await supabase
    .from("profiles")
    .update({
      is_pro: false,
    })
    .eq("id", userId)
}

/* =========================================================
   CORE: APPLY REFERRAL REWARD
   - First payment only
   - Both users get 1 month
========================================================= */

export async function applyReferralReward(userId: string) {
  const supabase = getAdminClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_used, referred_by")
    .eq("id", userId)
    .single()

  if (!profile || profile.referral_used || !profile.referred_by) return

  const { data: owner } = await supabase
    .from("profiles")
    .select("id, pro_expires_at")
    .eq("referral_code", profile.referred_by)
    .single()

  if (!owner) return

  const ownerExpiry = addOneMonth(owner.pro_expires_at)

  await Promise.all([
    supabase
      .from("profiles")
      .update({ referral_used: true })
      .eq("id", userId),

    supabase
      .from("profiles")
      .update({
        is_pro: true,
        pro_expires_at: ownerExpiry,
      })
      .eq("id", owner.id),
  ])
}

/* =========================================================
   HIGH-LEVEL WORKFLOWS (Webhook Ready)
========================================================= */

/**
 * Called on:
 * subscription.activated
 * subscription.charged
 * payment.captured
 */
export async function handleSuccessfulPayment(userId: string) {
  await activateProPlan(userId)
  await applyReferralReward(userId)
}

/**
 * Called on:
 * subscription.cancelled
 */
export async function handleCancellation(userId: string) {
  await cancelProPlan(userId)
}

/* =========================================================
   OPTIONAL: Manual Admin Upgrade
========================================================= */

export async function grantFreeProDays(
  userId: string,
  days: number
) {
  const supabase = getAdminClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("pro_expires_at")
    .eq("id", userId)
    .single()

  const d = profile?.pro_expires_at
    ? new Date(profile.pro_expires_at)
    : new Date()

  d.setDate(d.getDate() + days)

  await supabase
    .from("profiles")
    .update({
      is_pro: true,
      pro_expires_at: d.toISOString(),
    })
    .eq("id", userId)
}
