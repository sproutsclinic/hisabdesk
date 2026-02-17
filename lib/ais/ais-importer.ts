ï»¿/*
=========================================================
AIS / 26AS IMPORTER ENGINE
Phase B ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Day 8

Enterprise grade
Offline safe
No external deps
Pure parser layer

Supports:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ AIS JSON (preferred)
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ AIS CSV
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ 26AS CSV
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Normalized transactions
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Bulk insert ready

Used by:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ /api/ais/import (next step)
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Tax reconciliation engine
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ AI suggestions engine

IMPORTANT
This file DOES NOT write DB
Only parsing + normalization
(API layer will persist)
=========================================================
*/

import fs from "fs"

/* ======================================================
TYPES
====================================================== */

export type AISTransactionType =
  | "salary"
  | "interest"
  | "dividend"
  | "business"
  | "tds"
  | "tcs"
  | "gst"
  | "other"

export interface AISTransaction {
  date: string
  description: string
  amount: number
  section?: string
  counterparty?: string
  pan?: string
  type: AISTransactionType
  source: "AIS" | "26AS"
}

/* ======================================================
MAIN ENTRY
====================================================== */

export async function importAISFile(
  filePath: string
): Promise<AISTransaction[]> {
  const content = fs.readFileSync(filePath, "utf-8")

  if (filePath.endsWith(".json")) {
    return parseAISJSON(content)
  }

  if (filePath.endsWith(".csv")) {
    return parseCSV(content)
  }

  throw new Error("Unsupported AIS/26AS format")
}

/* ======================================================
JSON PARSER (AIS native)
====================================================== */

function parseAISJSON(text: string): AISTransaction[] {
  const raw = JSON.parse(text)

  const list: AISTransaction[] = []

  const sections =
    raw?.data ||
    raw?.transactions ||
    raw?.financialInformation ||
    []

  for (const item of sections) {
    list.push(normalizeJSONRow(item))
  }

  return list
}

function normalizeJSONRow(row: any): AISTransaction {
  const amount =
    Number(row.amount || row.transactionAmount || 0)

  return {
    date: normalizeDate(row.date || row.transactionDate),
    description: row.description || row.narration || "AIS Entry",
    amount,
    section: row.sectionCode,
    counterparty: row.deductorName || row.bankName,
    pan: row.pan,
    type: detectType(row.description || "", row.sectionCode),
    source: "AIS",
  }
}

/* ======================================================
CSV PARSER (AIS or 26AS)
====================================================== */

function parseCSV(text: string): AISTransaction[] {
  const rows = text.split("\n").filter(Boolean)

  if (rows.length < 2) return []

  const headers = rows[0].split(",").map(clean)

  const list: AISTransaction[] = []

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",").map(clean)

    const obj: Record<string, string> = {}

    headers.forEach((h, idx) => {
      obj[h] = cols[idx]
    })

    list.push(normalizeCSVRow(obj))
  }

  return list
}

function normalizeCSVRow(row: Record<string, string>): AISTransaction {
  const description =
    row.description ||
    row.narration ||
    row.particulars ||
    "Entry"

  const amount =
    Number(row.amount || row.credit || row.transaction || 0)

  return {
    date: normalizeDate(row.date || row.transaction_date),
    description,
    amount,
    section: row.section,
    counterparty: row.deductor || row.bank,
    pan: row.pan,
    type: detectType(description, row.section),
    source: "26AS",
  }
}

/* ======================================================
TYPE DETECTION ENGINE
====================================================== */

function detectType(
  description: string,
  section?: string
): AISTransactionType {
  const d = description.toLowerCase()

  if (d.includes("salary")) return "salary"
  if (d.includes("interest")) return "interest"
  if (d.includes("dividend")) return "dividend"
  if (d.includes("tds")) return "tds"
  if (d.includes("tcs")) return "tcs"
  if (d.includes("gst")) return "gst"

  if (section?.startsWith("194") || section?.startsWith("44"))
    return "business"

  return "other"
}

/* ======================================================
UTILS
====================================================== */

function normalizeDate(d?: string) {
  if (!d) return new Date().toISOString()

  const date = new Date(d)
  if (isNaN(date.getTime())) return new Date().toISOString()

  return date.toISOString()
}

function clean(v: string) {
  return v?.replace(/"/g, "").trim()
}
