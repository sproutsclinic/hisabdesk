import { createClient } from "@supabase/supabase-js"

type InvoiceType = "sales" | "purchase"

export type GSTCategory =
  | "b2b"
  | "b2c_large"
  | "b2c_small"
  | "export"
  | "reverse_charge"
  | "nil_rated"
  | "exempt"
  | "non_gst"
  | "unknown"

interface ClassifyOptions {
  orgId: string
}

/*
=========================================================
GST CLASSIFICATION ENGINE
Enterprise-grade
Idempotent
No new tables
Updates ONLY gst_invoices + gst_summary

Purpose:
Auto-classify invoices for:
- GSTR-1
- GSTR-3B
- Compliance buckets

Safe rules:
Deterministic
No AI
Fast batch updates
=========================================================
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function classifyGSTInvoices({ orgId }: ClassifyOptions) {
  const { data: invoices, error } = await supabase
    .from("gst_invoices")
    .select("*")
    .eq("org_id", orgId)

  if (error) throw error
  if (!invoices?.length) return emptySummary()

  const updates: { id: string; category: GSTCategory }[] = []

  const counts: Record<GSTCategory, number> = {
    b2b: 0,
    b2c_large: 0,
    b2c_small: 0,
    export: 0,
    reverse_charge: 0,
    nil_rated: 0,
    exempt: 0,
    non_gst: 0,
    unknown: 0,
  }

  for (const inv of invoices) {
    const category = classify(inv)
    updates.push({ id: inv.id, category })
    counts[category]++
  }

  const chunks = chunk(updates, 200)

  for (const group of chunks) {
    await Promise.all(
      group.map((u) =>
        supabase
          .from("gst_invoices")
          .update({
            gst_category: u.category,
            classified_at: new Date().toISOString(),
          })
          .eq("id", u.id)
      )
    )
  }

  await supabase.from("gst_summary").upsert(
    {
      org_id: orgId,
      classification_breakup: counts,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "org_id" }
  )

  return counts
}

/*
=========================================================
RULES ENGINE
=========================================================
*/

function classify(inv: any): GSTCategory {
  const total = Number(inv.total || 0)
  const tax = Number(inv.tax_total || inv.gst_total || 0)
  const gstin = (inv.gstin || "").trim()
  const placeOfSupply = (inv.place_of_supply || "").toUpperCase()
  const reverseCharge = Boolean(inv.reverse_charge)

  if (reverseCharge) return "reverse_charge"

  if (inv.type === "sales") {
    if (!gstin) {
      if (total >= 250000) return "b2c_large"
      return "b2c_small"
    }
    if (placeOfSupply === "EXPORT" || inv.is_export) return "export"
    return "b2b"
  }

  if (tax === 0 && total > 0) return "nil_rated"

  if (inv.exempt === true) return "exempt"

  if (total === 0) return "non_gst"

  return "unknown"
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
    b2b: 0,
    b2c_large: 0,
    b2c_small: 0,
    export: 0,
    reverse_charge: 0,
    nil_rated: 0,
    exempt: 0,
    non_gst: 0,
    unknown: 0,
  }
}
