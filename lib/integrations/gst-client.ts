"use server"

/**
 * =========================================================
 * GST Client (Integration Layer)
 * HisabDesk – Phase A Day 2
 * =========================================================
 *
 * PURPOSE
 * Central place to talk to GST systems.
 *
 * TODAY
 *   ✓ mock mode (works instantly)
 *   ✓ standardized structure
 *
 * LATER
 *   ✓ plug real Govt API
 *   ✓ plug GST Suvidha Provider (GSP)
 *
 * NEVER call external GST directly from UI.
 * ALWAYS go through this client.
 *
 * =========================================================
 *
 * USAGE
 *
 * import { fetchGSTInvoices } from "@/lib/integrations/gst-client"
 *
 * const invoices = await fetchGSTInvoices({
 *   gstin: "...",
 *   period: "2026-01"
 * })
 *
 * =========================================================
 */

 /* =========================================================
    TYPES
 ========================================================= */

export type GSTFetchInput = {
  gstin: string
  period: string // YYYY-MM
}

export type GSTInvoice = {
  invoice_number: string
  invoice_date: string
  party_name: string
  party_gstin: string
  type: "sale" | "purchase"
  taxable_value: number
  cgst: number
  sgst: number
  igst: number
  cess: number
}

export type GSTSummary = {
  total_sales: number
  total_purchase: number
  output_tax: number
  input_tax: number
  net_payable: number
}

/* =========================================================
   CONFIG
========================================================= */

/**
 * Keep true for now.
 * Later switch to real API.
 */
const USE_MOCK = true

/* =========================================================
   MAIN API
========================================================= */

export async function fetchGSTInvoices(
  input: GSTFetchInput
): Promise<GSTInvoice[]> {
  if (USE_MOCK) return mockInvoices(input)

  return fetchFromRealAPI(input)
}

export async function fetchGSTSummary(
  input: GSTFetchInput
): Promise<GSTSummary> {
  if (USE_MOCK) {
    const invoices = mockInvoices(input)

    let sales = 0
    let purchase = 0
    let outputTax = 0
    let inputTax = 0

    for (const i of invoices) {
      const tax = i.cgst + i.sgst + i.igst + i.cess

      if (i.type === "sale") {
        sales += i.taxable_value
        outputTax += tax
      } else {
        purchase += i.taxable_value
        inputTax += tax
      }
    }

    return {
      total_sales: sales,
      total_purchase: purchase,
      output_tax: outputTax,
      input_tax: inputTax,
      net_payable: outputTax - inputTax,
    }
  }

  return fetchSummaryFromRealAPI(input)
}

/* =========================================================
   REAL API PLACEHOLDER (future)
========================================================= */

async function fetchFromRealAPI(
  _input: GSTFetchInput
): Promise<GSTInvoice[]> {
  /**
   Later:
   call GSP provider
   example:
   fetch("https://api.gsp.com/gstr1")
   */

  return []
}

async function fetchSummaryFromRealAPI(
  _input: GSTFetchInput
): Promise<GSTSummary> {
  return {
    total_sales: 0,
    total_purchase: 0,
    output_tax: 0,
    input_tax: 0,
    net_payable: 0,
  }
}

/* =========================================================
   MOCK DATA (dev only)
========================================================= */

function mockInvoices(input: GSTFetchInput): GSTInvoice[] {
  const seed = input.period.replace("-", "")

  return [
    {
      invoice_number: `S-${seed}-001`,
      invoice_date: `${input.period}-05`,
      party_name: "Client A Pvt Ltd",
      party_gstin: "29ABCDE1234F1Z5",
      type: "sale",
      taxable_value: 25000,
      cgst: 2250,
      sgst: 2250,
      igst: 0,
      cess: 0,
    },
    {
      invoice_number: `P-${seed}-001`,
      invoice_date: `${input.period}-10`,
      party_name: "Vendor Tools Co",
      party_gstin: "29AAAAA0000A1Z5",
      type: "purchase",
      taxable_value: 12000,
      cgst: 1080,
      sgst: 1080,
      igst: 0,
      cess: 0,
    },
    {
      invoice_number: `S-${seed}-002`,
      invoice_date: `${input.period}-15`,
      party_name: "Client B LLP",
      party_gstin: "29BBBBB2222B1Z5",
      type: "sale",
      taxable_value: 18000,
      cgst: 1620,
      sgst: 1620,
      igst: 0,
      cess: 0,
    },
  ]
}
