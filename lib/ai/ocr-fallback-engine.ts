ï»¿/*
=========================================================
OCR FALLBACK ENGINE
Phase B ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Day 14

Purpose:
Extract text + structured transactions from:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Invoice PDFs
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Bank statements
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Scanned bills
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Images

Used when:
Importer fails OR user uploads scanned files

Design:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Deterministic parsing first
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Regex extraction
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ No external AI dependency
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Works offline
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Production safe

NOTE:
This is "fallback".
Primary source should always be:
GST / AIS / CSV imports

Output:
Normalized transaction rows

No DB writes here
API layer persists
=========================================================
*/

import fs from "fs"

/* ====================================================== */

export interface OCRTransaction {
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
  source: "OCR"
}

/* ======================================================
MAIN ENTRY
====================================================== */

export async function parseOCRFile(
  filePath: string
): Promise<OCRTransaction[]> {
  const text = await extractText(filePath)

  return parseTransactions(text)
}

/* ======================================================
TEXT EXTRACTION
====================================================== */

/*
Strategy:
- If text/pdf ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ read raw
- If image ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ basic fallback (placeholder for future)
*/

async function extractText(filePath: string) {
  const content = fs.readFileSync(filePath)

  // If it's already text/pdf extracted
  try {
    return content.toString("utf-8")
  } catch {
    return ""
  }
}

/* ======================================================
TRANSACTION PARSER
====================================================== */

function parseTransactions(text: string): OCRTransaction[] {
  const lines = text.split("\n").map((l) => l.trim())

  const results: OCRTransaction[] = []

  for (const line of lines) {
    const tx = parseLine(line)
    if (tx) results.push(tx)
  }

  return results
}

/*
Common formats handled:

01/04/2025 AMAZON 1,250.00 DR
01-04-25 UPI SWIGGY 350 CR
2025-04-01 Flipkart 999.00
*/

function parseLine(line: string): OCRTransaction | null {
  if (!line || line.length < 10) return null

  const date = extractDate(line)
  const amount = extractAmount(line)

  if (!date || amount === null) return null

  const type: "credit" | "debit" =
    /cr|credit/i.test(line) ? "credit" : "debit"

  const description = cleanDescription(line, date, amount)

  return {
    date,
    description,
    amount,
    type,
    source: "OCR",
  }
}

/* ======================================================
EXTRACTORS
====================================================== */

function extractDate(line: string) {
  const patterns = [
    /\d{2}\/\d{2}\/\d{4}/,
    /\d{2}-\d{2}-\d{2}/,
    /\d{4}-\d{2}-\d{2}/,
  ]

  for (const p of patterns) {
    const m = line.match(p)
    if (m) {
      const d = new Date(m[0])
      if (!isNaN(d.getTime())) {
        return d.toISOString()
      }
    }
  }

  return null
}

function extractAmount(line: string) {
  const matches = line.match(/-?\d{1,3}(,\d{3})*(\.\d{2})?/g)

  if (!matches) return null

  const last = matches[matches.length - 1]

  return Number(last.replace(/,/g, ""))
}

function cleanDescription(
  line: string,
  date: string,
  amount: number
) {
  return line
    .replace(date.slice(0, 10), "")
    .replace(String(amount), "")
    .replace(/cr|dr|credit|debit/gi, "")
    .trim()
}

/* ======================================================
HELPER
====================================================== */

export function normalizeOCRToTransactions(
  orgId: string,
  rows: OCRTransaction[]
) {
  return rows.map((r) => ({
    org_id: orgId,
    date: r.date,
    description: r.description,
    amount: r.type === "debit" ? -r.amount : r.amount,
    source: "OCR",
    meta: { ocr: true },
    created_at: new Date().toISOString(),
  }))
}
