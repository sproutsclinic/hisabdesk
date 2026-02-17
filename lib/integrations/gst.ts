ï»¿/**
 * =========================================
 * GST API Integration Layer
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase A
 * Enterprise-ready service wrapper
 * =========================================
 *
 * SAFE:
 * - No existing files modified
 * - Pure server utility
 *
 * ENV REQUIRED:
 * GST_API_BASE_URL=
 * GST_API_KEY=
 * GST_API_SECRET=
 */

"use server"

import crypto from "crypto"

type GSTFetchOptions = {
  method?: "GET" | "POST"
  body?: any
  headers?: Record<string, string>
}

const BASE_URL = process.env.GST_API_BASE_URL!
const API_KEY = process.env.GST_API_KEY!
const API_SECRET = process.env.GST_API_SECRET!

/* ========================================================
   INTERNAL: HMAC SIGNING (enterprise compliance ready)
======================================================== */
function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", API_SECRET)
    .update(payload)
    .digest("hex")
}

/* ========================================================
   INTERNAL: Secure Fetch Wrapper
======================================================== */
async function gstFetch<T>(
  path: string,
  options: GSTFetchOptions = {}
): Promise<T> {
  if (!BASE_URL || !API_KEY || !API_SECRET) {
    throw new Error("GST environment variables missing")
  }

  const bodyString = options.body ? JSON.stringify(options.body) : ""
  const signature = signPayload(bodyString)

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-signature": signature,
      ...options.headers
    },
    body: bodyString || undefined,
    cache: "no-store"
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GST API Error: ${text}`)
  }

  return res.json()
}

/* ========================================================
   PUBLIC METHODS
======================================================== */

/**
 * Validate GSTIN
 */
export async function validateGSTIN(gstin: string) {
  return gstFetch<{
    valid: boolean
    legalName: string
    tradeName?: string
    status: string
    state: string
    registrationDate: string
  }>(`/gst/validate/${gstin}`)
}

/**
 * Fetch taxpayer profile
 */
export async function getGSTProfile(gstin: string) {
  return gstFetch(`/gst/profile/${gstin}`)
}

/**
 * Fetch filed returns summary
 */
export async function getReturnSummary(
  gstin: string,
  financialYear: string
) {
  return gstFetch(`/gst/returns/summary`, {
    method: "POST",
    body: { gstin, financialYear }
  })
}

/**
 * Fetch invoices (GSTR-1)
 */
export async function getInvoices(
  gstin: string,
  period: string
) {
  return gstFetch(`/gst/invoices`, {
    method: "POST",
    body: { gstin, period }
  })
}

/**
 * Match purchases (GSTR-2B)
 */
export async function getPurchaseMatches(
  gstin: string,
  period: string
) {
  return gstFetch(`/gst/purchases/match`, {
    method: "POST",
    body: { gstin, period }
  })
}

/**
 * Compute ITC automatically
 */
export async function computeITC(
  gstin: string,
  period: string
) {
  return gstFetch(`/gst/itc/compute`, {
    method: "POST",
    body: { gstin, period }
  })
}

/* ========================================================
   Helpers
======================================================== */

export function isValidGSTFormat(gstin: string) {
  const regex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return regex.test(gstin)
}
