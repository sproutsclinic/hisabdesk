"use server"

/**
 * =========================================================
 * Usage Tracker (Billing Enforcement Engine)
 * HisabDesk – Monetization Core
 * =========================================================
 *
 * PURPOSE
 * Central helper to:
 *   ✓ count current usage
 *   ✓ compare with plan limits
 *   ✓ block actions when exceeded
 *
 * This is the SERVER-SIDE enforcement layer.
 *
 * IMPORTANT
 * ---------------------------------------------------------
 * UI meters are cosmetic only.
 * THIS file actually enforces limits securely.
 *
 * =========================================================
 *
 * USAGE (API / server action)
 *
 * await assertCanCreateExpense(userId, orgId)
 *
 * =========================================================
 *
 * SAFE
 * - server only
 * - read only
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"
import {
  getPlanLimits,
  canUse,
} from "@/lib/billing/plan-limits"

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
   GENERIC COUNTER
========================================================= */

async function countRows(
  table: string,
  orgId: string
) {
  const supabase = getClient()

  const { count } = await supabase
    .from(table)
    .select("id", {
      head: true,
      count: "exact",
    })
    .eq("org_id", orgId)

  return count || 0
}

/* =========================================================
   ASSERT HELPERS
========================================================= */

export async function assertCanCreateExpense(
  userId: string,
  orgId: string
) {
  const limits = await getPlanLimits(userId)
  const current = await countRows("expenses", orgId)

  if (!canUse(current, limits.expenses)) {
    throw new Error("Expense limit reached. Upgrade plan.")
  }
}

export async function assertCanCreateInvoice(
  userId: string,
  orgId: string
) {
  const limits = await getPlanLimits(userId)
  const current = await countRows("income", orgId)

  if (!canUse(current, limits.invoices)) {
    throw new Error("Invoice limit reached. Upgrade plan.")
  }
}

export async function assertCanUploadDocument(
  userId: string,
  orgId: string
) {
  const limits = await getPlanLimits(userId)
  const current = await countRows(
    "org_documents",
    orgId
  )

  if (!canUse(current, limits.documents)) {
    throw new Error("Document limit reached. Upgrade plan.")
  }
}

/* =========================================================
   GST SYNC LIMIT (monthly)
========================================================= */

export async function assertCanSyncGST(
  userId: string,
  orgId: string
) {
  const limits = await getPlanLimits(userId)

  const supabase = getClient()

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from("audit_logs")
    .select("id", {
      head: true,
      count: "exact",
    })
    .eq("org_id", orgId)
    .ilike("action", "%GST sync%")
    .gte("created_at", monthStart.toISOString())

  const current = count || 0

  if (!canUse(current, limits.gstSyncsPerMonth)) {
    throw new Error("Monthly GST sync limit reached.")
  }
}
