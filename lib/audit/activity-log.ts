/**
 * =========================================================
 * Activity Log (Enterprise Audit Trail)
 * HisabDesk – Security + Compliance Layer
 * =========================================================
 *
 * PURPOSE
 * Track EVERYTHING users/admins do:
 *
 *   ✓ login
 *   ✓ expense added
 *   ✓ income edited
 *   ✓ report exported
 *   ✓ subscription changed
 *   ✓ admin actions
 *   ✓ org member changes
 *
 * WHY IMPORTANT
 * Required for:
 *   ✓ CA compliance
 *   ✓ disputes
 *   ✓ internal audits
 *   ✓ security investigations
 *   ✓ enterprise customers
 *
 * Think:
 *   "Who did what and when?"
 *
 * SAFE
 * - server only
 * - no existing files modified
 *
 * =========================================================
 *
 * REQUIRED TABLE (Supabase SQL)
 *
 * create table activity_logs (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid,
 *   org_id uuid,
 *   action text not null,
 *   entity text,
 *   entity_id text,
 *   meta jsonb,
 *   created_at timestamp default now()
 * );
 *
 * =========================================================
 *
 * USAGE
 *
 * await logActivity({
 *   userId,
 *   action: "expense_created",
 *   entity: "expense",
 *   entityId: expense.id,
 *   meta: { amount: 500 }
 * })
 *
 * =========================================================
 */

"use server"

import { createClient } from "@supabase/supabase-js"

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
   TYPES
========================================================= */

type ActivityInput = {
  userId?: string | null
  orgId?: string | null
  action: string
  entity?: string
  entityId?: string | number
  meta?: Record<string, any>
}

/* =========================================================
   CORE LOGGER
========================================================= */

export async function logActivity(input: ActivityInput) {
  try {
    const supabase = getAdminClient()

    await supabase.from("activity_logs").insert({
      user_id: input.userId ?? null,
      org_id: input.orgId ?? null,
      action: input.action,
      entity: input.entity ?? null,
      entity_id: input.entityId?.toString() ?? null,
      meta: input.meta ?? {},
    })
  } catch {
    /* never break business logic */
  }
}

/* =========================================================
   COMMON PRESETS (helpers)
========================================================= */

export function logLogin(userId: string) {
  return logActivity({
    userId,
    action: "login",
  })
}

export function logExpenseCreated(
  userId: string,
  expenseId: string,
  amount: number
) {
  return logActivity({
    userId,
    action: "expense_created",
    entity: "expense",
    entityId: expenseId,
    meta: { amount },
  })
}

export function logReportExport(userId: string) {
  return logActivity({
    userId,
    action: "report_exported",
  })
}

export function logAdminAction(
  adminId: string,
  action: string,
  meta?: any
) {
  return logActivity({
    userId: adminId,
    action: `admin_${action}`,
    meta,
  })
}
