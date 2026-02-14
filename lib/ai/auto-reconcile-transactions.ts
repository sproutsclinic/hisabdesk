"use server"

/**
 * =========================================================
 * Auto Reconcile Integration (DB Layer)
 * HisabDesk – Phase B (AI Integration)
 * =========================================================
 *
 * PURPOSE
 * Uses your EXISTING:
 *   reconcileTransactions()
 *
 * Adds:
 *   ✓ DB fetch
 *   ✓ DB updates
 *   ✓ mark reconciled
 *   ✓ confidence stored
 *
 * IMPORTANT
 * ---------------------------------------------------------
 * DOES NOT replace your engine
 * Only integrates it with Supabase
 *
 * Architecture:
 *
 *   fetch → reconcile → update
 *
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"

import {
  reconcileTransactions,
  reconciliationStats,
  type BankTxn,
  type LedgerEntry,
} from "@/lib/ai/auto-reconcilation"

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
   MAIN AUTO RECONCILE
========================================================= */

export async function autoReconcileOrg(orgId: string) {
  const supabase = getClient()

  /* ------------------------------------------------------
     1️⃣ FETCH DATA
  ------------------------------------------------------ */

  const [bankRes, expenseRes] = await Promise.all([
    supabase
      .from("bank_transactions")
      .select("id, amount, date, description")
      .eq("org_id", orgId)
      .is("reconciled_with", null),

    supabase
      .from("expenses")
      .select("id, amount, created_at as date, description")
      .eq("org_id", orgId)
      .is("reconciled_with", null),
  ])

  const bankTxns = (bankRes.data || []) as BankTxn[]
  const ledger = (expenseRes.data || []) as LedgerEntry[]

  if (!bankTxns.length || !ledger.length) {
    return { matched: 0 }
  }

  /* ------------------------------------------------------
     2️⃣ RUN ENGINE (your existing logic)
  ------------------------------------------------------ */

  const result = reconcileTransactions(bankTxns, ledger)

  /* ------------------------------------------------------
     3️⃣ APPLY MATCHES
  ------------------------------------------------------ */

  for (const m of result.matched) {
    await Promise.all([
      supabase
        .from("bank_transactions")
        .update({
          reconciled_with: m.ledgerId,
          confidence: m.confidence,
        })
        .eq("id", m.bankId),

      supabase
        .from("expenses")
        .update({
          reconciled_with: m.bankId,
          confidence: m.confidence,
        })
        .eq("id", m.ledgerId),
    ])
  }

  /* ------------------------------------------------------
     4️⃣ RETURN STATS
  ------------------------------------------------------ */

  return reconciliationStats(result)
}
