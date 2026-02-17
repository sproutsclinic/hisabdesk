ï»¿// ==========================================================
// Notifications Service (Server only)
// Layer: API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ DB
//
// PURPOSE
// Central notification dispatcher
//
// Used by:
// - bills.service
// - loans.service
// - automation
// - future alerts
//
// RESPONSIBILITIES
// - fetch undelivered notifications
// - mark delivered
// - return counts
//
// NOTE (Phase 1):
// DB only (in-app notifications)
// Later:
// email / push / whatsapp adapters can plug in here
//
// RULES
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ orchestration only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ DB only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO business calculations
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO UI
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO HTTP
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO OpenAI
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
Types
========================================================= */

export interface NotificationRow {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  delivered_at: string | null
  created_at: string
}

/* =========================================================
Public Runner (Cron entry)
========================================================= */

/**
 * Called by:
 * /api/cron/automation
 *
 * Phase 1 behaviour:
 * - mark notifications as delivered
 * - future: send emails/push
 *
 * Returns:
 * number of notifications processed
 */
export async function runNotificationsDispatch(): Promise<number> {
  const supabase = getSupabaseAdmin()

  // -------------------------------------------------------
  // 1. fetch pending notifications
  // -------------------------------------------------------

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        delivered_at,
        created_at
      `
    )
    .is("delivered_at", null)
    .order("created_at", { ascending: true })
    .limit(500)

  if (error) {
    throw new Error(error.message)
  }

  if (!data || data.length === 0) return 0

  // -------------------------------------------------------
  // 2. (Future) send adapters here
  // email/push/sms
  // -------------------------------------------------------
  // intentionally empty for now

  // -------------------------------------------------------
  // 3. mark delivered
  // -------------------------------------------------------

  const ids = data.map((n) => n.id)

  const { error: updateError } = await supabase
    .from("notifications")
    .update({
      delivered_at: new Date().toISOString(),
    })
    .in("id", ids)

  if (updateError) {
    throw new Error(updateError.message)
  }

  // -------------------------------------------------------
  // return count
  // -------------------------------------------------------

  return ids.length
}
