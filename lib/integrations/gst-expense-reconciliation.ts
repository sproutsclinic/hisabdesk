"use server"

/**
 * =========================================================
 * GST ↔ Expense Reconciliation Engine
 * HisabDesk – Phase A Day 6
 * =========================================================
 *
 * PURPOSE
 * Auto-match:
 *   ✓ GST purchase invoices
 *   ✓ expense entries
 *
 * So user DOES NOT manually match bills.
 *
 * WHAT THIS DOES
 *   ✓ amount match
 *   ✓ date tolerance (±3 days)
 *   ✓ vendor similarity
 *   ✓ confidence score
 *   ✓ saves reconciled links
 *
 * RESULT
 *   purchase invoice  ←→  expense row
 *
 * Similar to:
 *   QuickBooks auto match
 *   Zoho Books smart reconciliation
 *
 * =========================================================
 *
 * CONNECTS TO
 *   gst_invoices
 *   expenses
 *
 * WRITES
 *   reconciled_with
 *   confidence
 *
 * SAFE
 * - server only
 * - integration layer only
 *
 * =========================================================
 *
 * USAGE
 *
 * import { reconcileGSTExpenses } from "@/lib/integrations/gst-expense-reconciliation"
 *
 * await reconcileGSTExpenses(orgId)
 *
 * Call after:
 *   ✓ GST sync
 *   ✓ expense import
 *
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   TYPES
========================================================= */

type GSTInvoice = {
  id: string
  taxable_value: number
  invoice_date: string
  party_name?: string | null
}

type Expense = {
  id: string
  amount: number
  created_at: string
  description?: string | null
}

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

function normalize(text?: string | null) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
}

function daysDiff(a: string, b: string) {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return Math.abs(d1 - d2) / (1000 * 60 * 60 * 24)
}

function similarity(a: string, b: string) {
  if (!a || !b) return 0

  const A = new Set(a.split(" "))
  const B = new Set(b.split(" "))

  let match = 0

  for (const w of A) {
    if (B.has(w)) match++
  }

  return match / Math.max(A.size, B.size)
}

/* =========================================================
   SCORE ENGINE
========================================================= */

function scoreMatch(gst: GSTInvoice, exp: Expense) {
  let score = 0

  /* Amount (strongest) */
  if (Math.abs(gst.taxable_value - exp.amount) < 1) {
    score += 0.6
  }

  /* Date ±3 days */
  const diff = daysDiff(gst.invoice_date, exp.created_at)
  if (diff <= 1) score += 0.25
  else if (diff <= 3) score += 0.15

  /* Vendor similarity */
  const sim = similarity(
    normalize(gst.party_name),
    normalize(exp.description)
  )

  score += sim * 0.15

  return Math.min(score, 1)
}

/* =========================================================
   MAIN ENGINE
========================================================= */

export async function reconcileGSTExpenses(
  orgId: string,
  threshold = 0.7
) {
  const supabase = getClient()

  /* ------------------------------------------------------
     1️⃣ fetch purchase invoices
  ------------------------------------------------------ */

  const { data: gst } = await supabase
    .from("gst_invoices")
    .select("*")
    .eq("org_id", orgId)
    .eq("type", "purchase")
    .is("reconciled_with", null)

  /* ------------------------------------------------------
     2️⃣ fetch expenses
  ------------------------------------------------------ */

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("org_id", orgId)
    .is("reconciled_with", null)

  if (!gst?.length || !expenses?.length) {
    return { matched: 0 }
  }

  const usedExpense = new Set<string>()
  let matched = 0

  /* ------------------------------------------------------
     3️⃣ match
  ------------------------------------------------------ */

  for (const g of gst as GSTInvoice[]) {
    let best: { e: Expense; score: number } | null =
      null

    for (const e of expenses as Expense[]) {
      if (usedExpense.has(e.id)) continue

      const score = scoreMatch(g, e)

      if (!best || score > best.score) {
        best = { e, score }
      }
    }

    if (best && best.score >= threshold) {
      matched++
      usedExpense.add(best.e.id)

      await Promise.all([
        supabase
          .from("gst_invoices")
          .update({
            reconciled_with: best.e.id,
            confidence: Number(best.score.toFixed(2)),
          })
          .eq("id", g.id),

        supabase
          .from("expenses")
          .update({
            reconciled_with: g.id,
            confidence: Number(best.score.toFixed(2)),
          })
          .eq("id", best.e.id),
      ])
    }
  }

  return { matched }
}
