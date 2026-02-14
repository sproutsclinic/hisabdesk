/**
 * =========================================================
 * Invoice OCR + Smart Parser
 * HisabDesk – Phase B (AI Features)
 * =========================================================
 *
 * PURE UTILITY MODULE
 * ⚠ DO NOT add "use server" or "use client"
 * Must stay directive-free for Next 16 compatibility
 * =========================================================
 */

/* =========================================================
   TYPES
========================================================= */

export type ParsedInvoice = {
  vendor?: string
  invoiceNumber?: string
  invoiceDate?: string
  gstin?: string

  subtotal?: number
  gst?: number
  total?: number

  confidence: number
}

/* =========================================================
   HELPERS
========================================================= */

function clean(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
}

function toNumber(str?: string | null) {
  if (!str) return undefined
  return Number(str.replace(/[^0-9.]/g, ""))
}

function find(regex: RegExp, text: string) {
  const m = text.match(regex)
  return m?.[1]
}

/* =========================================================
   REGEX LIBRARY
========================================================= */

const REGEX = {
  gstin:
    /([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z])/,

  invoiceNumber:
    /(?:invoice\s*(?:no|number|#)[:\s]*)([A-Z0-9\-\/]+)/i,

  invoiceDate:
    /(?:date[:\s]*)(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,

  total:
    /(?:total\s*(?:amount|amt)?[:\s₹]*)([\d,]+\.\d{0,2}|\d+)/i,

  gst:
    /(?:gst|tax)[:\s₹]*([\d,]+\.\d{0,2}|\d+)/i,
}

/* =========================================================
   VENDOR DETECTION
========================================================= */

function detectVendor(text: string) {
  const lines = text.split("\n").slice(0, 5)

  for (const l of lines) {
    if (l.length > 5 && l.length < 60) {
      return l.trim()
    }
  }

  return undefined
}

/* =========================================================
   MAIN PARSER
========================================================= */

export function parseInvoiceText(rawText: string): ParsedInvoice {
  const text = clean(rawText)

  const invoiceNumber = find(REGEX.invoiceNumber, text)
  const invoiceDate = find(REGEX.invoiceDate, text)
  const gstin = find(REGEX.gstin, text)

  const totalStr = find(REGEX.total, text)
  const gstStr = find(REGEX.gst, text)

  const total = toNumber(totalStr)
  const gst = toNumber(gstStr)

  let subtotal: number | undefined

  if (total && gst) {
    subtotal = total - gst
  }

  let score = 0

  if (invoiceNumber) score += 0.25
  if (invoiceDate) score += 0.2
  if (gstin) score += 0.25
  if (total) score += 0.2
  if (gst) score += 0.1

  const confidence = Number(score.toFixed(2))

  return {
    vendor: detectVendor(text),
    invoiceNumber,
    invoiceDate,
    gstin,
    subtotal,
    gst,
    total,
    confidence,
  }
}

/* =========================================================
   BULK HELPER
========================================================= */

export function parseInvoicesBulk(texts: string[]) {
  return texts.map(parseInvoiceText)
}
