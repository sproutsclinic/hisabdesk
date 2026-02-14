/*
=========================================================
ANOMALY DETECTION ENGINE
Phase B — Day 13

Purpose:
Detect unusual / risky / suspicious transactions

Helps:
✓ Fraud detection
✓ Mistakes
✓ Large unexpected expenses
✓ Compliance risks
✓ CA review

Strategy:
Deterministic statistics (NO AI APIs)
Fast + explainable

Rules:
1. Outlier amount (z-score)
2. Weekend/odd hour postings
3. New/rare vendors
4. Round number spikes
5. Sudden large expense vs history

Output:
Anomaly list

No new tables
Only updates transactions.meta
=========================================================
*/

import { createClient } from "@supabase/supabase-js"

/* ====================================================== */

export type AnomalyType =
  | "amount_outlier"
  | "rare_vendor"
  | "weekend_entry"
  | "round_number"
  | "sudden_spike"

export interface Anomaly {
  id: string
  type: AnomalyType
  score: number
  reason: string
}

/* ====================================================== */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ======================================================
MAIN ENGINE
====================================================== */

export async function detectAnomalies(orgId: string) {
  const { data: tx, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("org_id", orgId)

  if (error) throw error
  if (!tx?.length) return []

  const anomalies: Anomaly[] = []

  /* ---------------------------------------------------
     STATS
  --------------------------------------------------- */

  const amounts = tx.map((t) => Math.abs(Number(t.amount || 0)))

  const mean = avg(amounts)
  const std = stdDev(amounts, mean)

  const vendorCounts = countBy(tx, (t) =>
    (t.meta?.counterparty || t.description || "").toLowerCase()
  )

  const maxVendorFreq = Math.max(...Object.values(vendorCounts))

  /* ---------------------------------------------------
     RULES
  --------------------------------------------------- */

  for (const t of tx) {
    const amt = Math.abs(Number(t.amount || 0))
    const date = new Date(t.date)

    /* 1. Amount outlier */
    const z = std ? Math.abs((amt - mean) / std) : 0
    if (z > 3) {
      anomalies.push({
        id: t.id,
        type: "amount_outlier",
        score: z,
        reason: "Transaction amount unusually high/low vs history",
      })
    }

    /* 2. Weekend entry */
    const day = date.getDay()
    if (day === 0 || day === 6) {
      anomalies.push({
        id: t.id,
        type: "weekend_entry",
        score: 0.6,
        reason: "Posted on weekend",
      })
    }

    /* 3. Rare vendor */
    const vendor =
      (t.meta?.counterparty || t.description || "").toLowerCase()

    const freq = vendorCounts[vendor] || 0

    if (freq <= Math.max(1, maxVendorFreq * 0.02)) {
      anomalies.push({
        id: t.id,
        type: "rare_vendor",
        score: 0.7,
        reason: "Vendor rarely used in books",
      })
    }

    /* 4. Round number spike */
    if (amt > 10000 && amt % 1000 === 0) {
      anomalies.push({
        id: t.id,
        type: "round_number",
        score: 0.5,
        reason: "Large round-number transaction",
      })
    }

    /* 5. Sudden spike */
    if (amt > mean * 5 && amt > 50000) {
      anomalies.push({
        id: t.id,
        type: "sudden_spike",
        score: 0.9,
        reason: "Sudden large expense/income",
      })
    }
  }

  /* ---------------------------------------------------
     UPDATE META
  --------------------------------------------------- */

  const updates = anomalies.map((a) => ({
    id: a.id,
    anomaly: {
      type: a.type,
      score: a.score,
      reason: a.reason,
      detected_at: new Date().toISOString(),
    },
  }))

  const chunks = chunk(updates, 300)

  for (const group of chunks) {
    await Promise.all(
      group.map((u) =>
        supabase
          .from("transactions")
          .update({
            meta: {
              anomaly: u.anomaly,
            },
          })
          .eq("id", u.id)
      )
    )
  }

  return anomalies
}

/* ======================================================
UTILS
====================================================== */

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function stdDev(arr: number[], mean: number) {
  const variance =
    arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    arr.length
  return Math.sqrt(variance)
}

function countBy<T>(
  list: T[],
  fn: (item: T) => string
): Record<string, number> {
  const map: Record<string, number> = {}

  for (const item of list) {
    const key = fn(item)
    map[key] = (map[key] || 0) + 1
  }

  return map
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}
