ï»¿/**
 * =========================================================
 * Razorpay Idempotency Protection
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Enterprise Safety Layer
 * =========================================================
 *
 * PURPOSE
 * Prevent duplicate webhook processing
 *
 * Razorpay retries same event multiple times.
 * This ensures:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no double subscription
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no double referral reward
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no duplicate DB writes
 *
 * USAGE (later inside webhook)
 *
 * const already = await isEventProcessed(event.id)
 * if (already) return NextResponse.json({ ok: true })
 *
 * await markEventProcessed(event.id, event.event)
 *
 * =========================================================
 */

"use server"

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   ADMIN CLIENT
========================================================= */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   CHECK IF EVENT ALREADY PROCESSED
========================================================= */

export async function isEventProcessed(eventId: string) {
  const supabase = getAdminClient()

  const { data } = await supabase
    .from("payment_events")
    .select("id")
    .eq("event_id", eventId)
    .maybeSingle()

  return !!data
}

/* =========================================================
   MARK EVENT AS PROCESSED
========================================================= */

export async function markEventProcessed(
  eventId: string,
  type: string
) {
  const supabase = getAdminClient()

  await supabase.from("payment_events").insert({
    event_id: eventId,
    type,
  })
}
