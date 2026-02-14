/**
 * =========================================
 * PAN Validation Integration Layer
 * HisabDesk – Phase A
 * Enterprise-grade service wrapper
 * =========================================
 *
 * SAFE:
 * - No existing files modified
 * - Server-only utility
 *
 * ENV REQUIRED:
 * PAN_API_BASE_URL=
 * PAN_API_KEY=
 * PAN_API_SECRET=
 */

"use server"

import crypto from "crypto"

type PanFetchOptions = {
  method?: "GET" | "POST"
  body?: any
  headers?: Record<string, string>
}

const BASE_URL = process.env.PAN_API_BASE_URL!
const API_KEY = process.env.PAN_API_KEY!
const API_SECRET = process.env.PAN_API_SECRET!

/* ========================================================
   INTERNAL — HMAC SIGNING
======================================================== */
function sign(payload: string) {
  return crypto
    .createHmac("sha256", API_SECRET)
    .update(payload)
    .digest("hex")
}

/* ========================================================
   INTERNAL — Secure Fetch Wrapper
======================================================== */
async function panFetch<T>(
  path: string,
  options: PanFetchOptions = {}
): Promise<T> {
  if (!BASE_URL || !API_KEY || !API_SECRET) {
    throw new Error("PAN environment variables missing")
  }

  const bodyString = options.body ? JSON.stringify(options.body) : ""
  const signature = sign(bodyString)

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
    throw new Error(`PAN API Error: ${text}`)
  }

  return res.json()
}

/* ========================================================
   PUBLIC METHODS
======================================================== */

/**
 * Basic format validation (instant, local)
 */
export function isValidPANFormat(pan: string) {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return regex.test(pan)
}

/**
 * Government / provider verification
 */
export async function validatePAN(pan: string) {
  return panFetch<{
    valid: boolean
    name: string
    category: string
    maskedAadhaar?: string
    status: "ACTIVE" | "INACTIVE"
  }>(`/pan/validate/${pan}`)
}

/**
 * Fetch PAN profile
 */
export async function getPANProfile(pan: string) {
  return panFetch(`/pan/profile/${pan}`)
}

/**
 * Bulk validation (CA / enterprise use)
 */
export async function bulkValidatePAN(pans: string[]) {
  return panFetch(`/pan/validate/bulk`, {
    method: "POST",
    body: { pans }
  })
}

/**
 * Mask PAN for UI logging
 */
export function maskPAN(pan: string) {
  if (pan.length !== 10) return pan
  return `${pan.slice(0, 3)}XXXX${pan.slice(-2)}`
}
