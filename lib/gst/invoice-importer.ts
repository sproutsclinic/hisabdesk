"use server"

/**
 * =========================================================
 * GST Invoice Importer (Invoice → DB Engine)
 * HisabDesk – Phase A Day 3
 * =========================================================
 *
 * PURPOSE
 * Normalizes + inserts invoice level GST data into:
 *   ✓ gst_invoices
 *
 * WHY SEPARATE FILE?
 * ---------------------------------------------------------
 * API route = transport
 * client = provider fetch
 * importer = DB transform logic  ← THIS FILE
 *
 * Clean architecture (enterprise standard)
 *
 * BENEFITS
 * ✓ reusable
 * ✓ testable
 * ✓ bulk import ready
 * ✓ future AI reconciliation ready
 *
 * =========================================================
 *
 * USAGE
 *
 * await importGSTInvoices(orgId, invoices)
 *
 * =========================================================
 */

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   TYPES (provider raw)
========================================================= */

export type RawGSTInvoice = {
  invoice_number: string
  invoice_date: string
  party_name: string
  party_gstin?: string | null

  type: "sale" | "purchase"

  taxable_value: number
  cgst: number
  sgst: number
  igst: number
  cess: number

  [key: string]: any
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

function calcTax(i: RawGSTInvoice) {
  return (
    Number(i.cgst || 0) +
    Number(i.sgst || 0) +
    Number(i.igst || 0) +
    Number(i.cess || 0)
  )
}

/* =========================================================
   MAIN IMPORTER
========================================================= */

export async function importGSTInvoices(
  orgId: string,
  invoices: RawGSTInvoice[]
) {
  if (!invoices?.length) return 0

  const supabase = getClient()

  /* ======================================================
     NORMALIZE → MATCH YOUR gst_invoices TABLE
  ====================================================== */

  const rows = invoices.map((i) => {
    const totalTax = calcTax(i)

    return {
      org_id: orgId,

      invoice_number: i.invoice_number,
      invoice_date: i.invoice_date,

      party_name: i.party_name,
      party_gstin: i.party_gstin ?? null,

      type: i.type,

      taxable_value: i.taxable_value,

      cgst: i.cgst || 0,
      sgst: i.sgst || 0,
      igst: i.igst || 0,
      cess: i.cess || 0,

      total_tax: totalTax,
      total_amount: Number(i.taxable_value) + totalTax,

      reconciled_with: null,
      confidence: 0,

      raw_json: i,
    }
  })

  /* ======================================================
     UPSERT (idempotent)
  ====================================================== */

  const { error } = await supabase
    .from("gst_invoices")
    .upsert(rows, {
      onConflict: "org_id,invoice_number",
    })

  if (error) throw error

  return rows.length
}

/* =========================================================
   BULK SAFE IMPORT (large files)
========================================================= */

export async function importGSTInvoicesInBatches(
  orgId: string,
  invoices: RawGSTInvoice[],
  batchSize = 500
) {
  let total = 0

  for (let i = 0; i < invoices.length; i += batchSize) {
    const chunk = invoices.slice(i, i + batchSize)
    total += await importGSTInvoices(orgId, chunk)
  }

  return total
}
