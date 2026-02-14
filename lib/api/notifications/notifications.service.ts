// ==========================================================
// Notifications Service (Server only)
// Layer: API → Service → DB
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
// ✅ orchestration only
// ✅ DB only
// ❌ NO business calculations
// ❌ NO UI
// ❌ NO HTTP
// ❌ NO OpenAI
// ==========================================================

import { createClient } from "@/lib/supabase/server"

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
  const supabase = createClient()

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
