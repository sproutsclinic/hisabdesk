/**
 * =========================================================
 * Payment Audit Logger (Enterprise Compliance)
 * HisabDesk
 * =========================================================
 *
 * PURPOSE
 * Financial-grade audit trail for:
 *   ✓ payments
 *   ✓ subscriptions
 *   ✓ refunds
 *   ✓ cancellations
 *   ✓ disputes
 *
 * WHY REQUIRED
 * Never depend only on Razorpay dashboard.
 *
 * Needed for:
 *   ✓ CA / tax audits
 *   ✓ accounting reconciliation
 *   ✓ disputes/refunds
 *   ✓ legal compliance
 *   ✓ revenue analytics
 *
 * SAFE
 * - Server only
 * - No existing file changes
 *
 * USAGE (later anywhere)
 *
 * await logPaymentEvent({
 *   userId,
 *   event: "subscription.charged",
 *   amount: 999,
 *   raw: event
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

type AuditInput = {
  userId?: string
  event: string
  amount?: number
  subscriptionId?: string
  paymentId?: string
  raw?: any
}

/* =========================================================
   CORE LOGGER
========================================================= */

export async function logPaymentEvent(input: AuditInput) {
  const supabase = getAdminClient()

  await supabase.from("payment_audit_logs").insert({
    user_id: input.userId ?? null,
    event: input.event,
    amount: input.amount ?? null,
    subscription_id: input.subscriptionId ?? null,
    payment_id: input.paymentId ?? null,
    raw: input.raw ?? null,
  })
}

/* =========================================================
   HELPERS (optional convenience wrappers)
========================================================= */

export async function logPaymentCaptured(
  userId: string,
  amount: number,
  raw: any
) {
  await logPaymentEvent({
    userId,
    event: "payment.captured",
    amount,
    raw,
  })
}

export async function logSubscriptionActivated(
  userId: string,
  subscriptionId: string,
  raw: any
) {
  await logPaymentEvent({
    userId,
    event: "subscription.activated",
    subscriptionId,
    raw,
  })
}

export async function logSubscriptionCancelled(
  userId: string,
  subscriptionId: string,
  raw: any
) {
  await logPaymentEvent({
    userId,
    event: "subscription.cancelled",
    subscriptionId,
    raw,
  })
}
