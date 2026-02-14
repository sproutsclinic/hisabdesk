"use server"

/*
=========================================================
GST SERVICE — ENTERPRISE SAFE (FINAL)
Week 2 Hardening

✓ retry
✓ timeout
✓ atomic transaction
✓ 2-decimal rounding (finance safe)
✓ non-negative payable
✓ env validation
✓ structured logs
=========================================================
*/

import { createClient } from "@supabase/supabase-js"
import { fetchGSTR1, fetchGSTR3B } from "./gst-client"

/* =========================================================
   ENV VALIDATION
========================================================= */

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  throw new Error("Missing Supabase env vars")
}

/* =========================================================
   CLIENT (singleton)
========================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

/* =========================================================
   UTILS
========================================================= */

const wait = (ms: number) =>
  new Promise((r) => setTimeout(r, ms))

const round2 = (n: number) =>
  Number((n || 0).toFixed(2))

async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastErr: any

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      await wait(1000 * (i + 1))
    }
  }

  throw lastErr
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms = 15000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ])
}

/* =========================================================
   TYPES
========================================================= */

export type GSTSyncResult = {
  period: string
  total_sales: number
  total_purchase: number
  output_tax: number
  input_tax: number
  net_payable: number
}

/* =========================================================
   MAIN
========================================================= */

export async function syncGST(
  orgId: string,
  period: string
): Promise<GSTSyncResult> {
  const start = Date.now()

  console.log("🔄 GST period sync:", orgId, period)

  /* ================= FETCH ================= */

  const [g1, g3] = await Promise.all([
    withRetry(() => withTimeout(fetchGSTR1(period))),
    withRetry(() => withTimeout(fetchGSTR3B(period))),
  ])

  /* ================= CALCULATE ================= */

  const totalSales = round2(g1.total_sales)
  const totalPurchase = round2(g3.total_purchase)
  const outputTax = round2(g1.total_tax)
  const inputTax = round2(g3.total_itc)

  const netPayable = round2(
    Math.max(0, outputTax - inputTax)
  )

  /* ================= ATOMIC WRITE ================= */

  const { error } = await supabase.rpc(
    "gst_upsert_summary_and_returns",
    {
      p_org_id: orgId,
      p_period: period,
      p_total_sales: totalSales,
      p_total_purchase: totalPurchase,
      p_output_tax: outputTax,
      p_input_tax: inputTax,
      p_net_payable: netPayable,
      p_raw_g1: g1.raw,
      p_raw_g3: g3.raw,
    }
  )

  if (error) throw error

  console.log(
    `✓ GST period synced in ${Date.now() - start}ms`
  )

  return {
    period,
    total_sales: totalSales,
    total_purchase: totalPurchase,
    output_tax: outputTax,
    input_tax: inputTax,
    net_payable: netPayable,
  }
}
