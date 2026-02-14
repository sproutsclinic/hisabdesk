import { createClient } from "@supabase/supabase-js"

type InvoiceType = "sales" | "purchase"

export type ReconciliationStatus =
  | "matched"
  | "partial"
  | "mismatch"
  | "missing"
  | "duplicate"

interface ReconcileOptions {
  orgId: string
  toleranceAmount?: number
  toleranceDays?: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/*
=====================================================
GST INVOICE RECONCILIATION ENGINE
Enterprise-safe
Idempotent
Multi-tenant aware
No schema changes
Works ONLY with existing gst_invoices table
=====================================================

Logic:

Sales vs Purchase matching:
- Same GSTIN
- Same invoice number (normalized)
- Amount within tolerance
- Date within tolerance

Outputs:
- summary object
- updates gst_summary
- does NOT create new tables
=====================================================
*/

function normalizeInvoiceNo(no: string | null | undefined) {
  if (!no) return ""
  return no.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
}

function daysDiff(a: string, b: string) {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return Math.abs(d1 - d2) / (1000 * 60 * 60 * 24)
}

export async function reconcileGSTInvoices({
  orgId,
  toleranceAmount = 1,
  toleranceDays = 3,
}: ReconcileOptions) {
  // -------------------------
  // Fetch invoices
  // -------------------------
  const { data: invoices, error } = await supabase
    .from("gst_invoices")
    .select("*")
    .eq("org_id", orgId)

  if (error) throw error
  if (!invoices?.length) return emptySummary()

  const sales = invoices.filter((i) => i.type === "sales")
  const purchase = invoices.filter((i) => i.type === "purchase")

  const purchaseMap = new Map<string, any[]>()

  // -------------------------
  // Index purchase invoices
  // -------------------------
  for (const p of purchase) {
    const key = `${p.gstin}|${normalizeInvoiceNo(p.invoice_no)}`
    if (!purchaseMap.has(key)) purchaseMap.set(key, [])
    purchaseMap.get(key)!.push(p)
  }

  const updates: { id: string; status: ReconciliationStatus }[] = []

  let matched = 0
  let partial = 0
  let mismatch = 0
  let missing = 0
  let duplicate = 0

  // -------------------------
  // Match sales → purchase
  // -------------------------
  for (const s of sales) {
    const key = `${s.gstin}|${normalizeInvoiceNo(s.invoice_no)}`
    const candidates = purchaseMap.get(key) || []

    if (candidates.length === 0) {
      updates.push({ id: s.id, status: "missing" })
      missing++
      continue
    }

    if (candidates.length > 1) {
      updates.push({ id: s.id, status: "duplicate" })
      duplicate++
      continue
    }

    const p = candidates[0]

    const amountDiff = Math.abs((s.total || 0) - (p.total || 0))
    const dateGap = daysDiff(s.invoice_date, p.invoice_date)

    if (amountDiff <= toleranceAmount && dateGap <= toleranceDays) {
      updates.push({ id: s.id, status: "matched" })
      updates.push({ id: p.id, status: "matched" })
      matched++
    } else if (amountDiff <= toleranceAmount * 5) {
      updates.push({ id: s.id, status: "partial" })
      updates.push({ id: p.id, status: "partial" })
      partial++
    } else {
      updates.push({ id: s.id, status: "mismatch" })
      updates.push({ id: p.id, status: "mismatch" })
      mismatch++
    }
  }

  // -------------------------
  // Batch update statuses
  // -------------------------
  const chunks = chunk(updates, 200)

  for (const group of chunks) {
    await Promise.all(
      group.map((u) =>
        supabase
          .from("gst_invoices")
          .update({
            reconciliation_status: u.status,
            reconciled_at: new Date().toISOString(),
          })
          .eq("id", u.id)
      )
    )
  }

  // -------------------------
  // Save summary
  // -------------------------
  const summary = {
    org_id: orgId,
    matched,
    partial,
    mismatch,
    missing,
    duplicate,
    total: invoices.length,
    updated_at: new Date().toISOString(),
  }

  await supabase.from("gst_summary").upsert(summary, {
    onConflict: "org_id",
  })

  return summary
}

/* ===================================================== */

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

function emptySummary() {
  return {
    matched: 0,
    partial: 0,
    mismatch: 0,
    missing: 0,
    duplicate: 0,
    total: 0,
  }
}
