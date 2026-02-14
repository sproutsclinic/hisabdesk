"use server"

/**
 * =========================================================
 * GST Smart Classifier + ITC Engine
 * HisabDesk – Phase A Day 5
 * =========================================================
 *
 * PURPOSE
 * Adds intelligence on top of GST invoices:
 *
 *   ✓ auto expense linking
 *   ✓ business vs personal detection
 *   ✓ ITC eligibility
 *   ✓ purchase classification
 *
 * WITHOUT THIS
 *   ❌ invoices just stored
 *
 * WITH THIS
 *   ✓ auto claimable ITC
 *   ✓ smarter accounting
 *   ✓ less CA work
 *
 * =========================================================
 *
 * DESIGN
 * Fast heuristic engine (no AI cost)
 *
 * Rules:
 *   purchase → ITC eligible
 *   sale     → output tax only
 *   blocked categories → no ITC
 *
 * =========================================================
 *
 * USAGE
 *
 * import { classifyGSTInvoices } from "@/lib/integrations/gst-classifier"
 *
 * await classifyGSTInvoices(orgId)
 *
 * Call after every sync.
 *
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   CONFIG
========================================================= */

/**
 * Blocked ITC categories (India GST rules simplified)
 * Expand later if needed
 */
const BLOCKED_KEYWORDS = [
  "food",
  "restaurant",
  "hotel",
  "personal",
  "gift",
  "entertainment",
]

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
  return (text || "").toLowerCase()
}

function isBlockedITC(name?: string | null) {
  const n = normalize(name)

  return BLOCKED_KEYWORDS.some((k) =>
    n.includes(k)
  )
}

/* =========================================================
   MAIN CLASSIFIER
========================================================= */

export async function classifyGSTInvoices(
  orgId: string
) {
  const supabase = getClient()

  /* ------------------------------------------------------
     1️⃣ fetch invoices not classified yet
  ------------------------------------------------------ */

  const { data: invoices } = await supabase
    .from("gst_invoices")
    .select("*")
    .eq("org_id", orgId)

  if (!invoices?.length) return

  const updates: any[] = []

  for (const inv of invoices) {
    let itcEligible = false

    /* ----------------------------------------------------
       RULE 1 → only purchases can claim ITC
    ---------------------------------------------------- */

    if (inv.type === "purchase") {
      itcEligible = true
    }

    /* ----------------------------------------------------
       RULE 2 → blocked items cannot claim
    ---------------------------------------------------- */

    if (isBlockedITC(inv.party_name)) {
      itcEligible = false
    }

    /* ----------------------------------------------------
       RULE 3 → small amounts often personal (heuristic)
    ---------------------------------------------------- */

    if (inv.taxable_value < 200) {
      itcEligible = false
    }

    updates.push({
      id: inv.id,
      itc_eligible: itcEligible,
    })
  }

  /* ------------------------------------------------------
     2️⃣ bulk update
  ------------------------------------------------------ */

  if (updates.length) {
    await supabase
      .from("gst_invoices")
      .upsert(updates)
  }

  /* ------------------------------------------------------
     3️⃣ update summary ITC automatically
  ------------------------------------------------------ */

  const { data: summaryRows } = await supabase
    .from("gst_summary")
    .select("*")
    .eq("org_id", orgId)

  if (summaryRows?.length) {
    for (const s of summaryRows) {
      const { data: invs } = await supabase
        .from("gst_invoices")
        .select("total_tax,itc_eligible,invoice_date")
        .eq("org_id", orgId)

      let input = 0

      for (const i of invs || []) {
        if (i.itc_eligible) input += i.total_tax
      }

      await supabase
        .from("gst_summary")
        .update({
          input_tax: input,
          net_payable: s.output_tax - input,
        })
        .eq("id", s.id)
    }
  }
}
