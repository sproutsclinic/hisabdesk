ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Tax Report Builder (Phase-H Compatible)
   ---------------------------------------------------------
   PURE formatting layer.
   No calculations.
   Reads the CURRENT TaxComputationResult contract.
   ========================================================= */

import type { TaxComputationResult } from "./types"

/* ========================================================= */

type ReportRow = {
  label: string
  value: string | number | null | undefined
}

/* ========================================================= */

function escapeCSV(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ""
  const s = String(value)
  if (s.includes(",") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/* =========================================================
   MAIN EXPORT (used by CSV + PDF)
   ========================================================= */

export function buildTaxCSV(result: TaxComputationResult): string {
  // Phase-H structure is normalized:
  // We print what actually exists instead of assuming fields.

  const rows: ReportRow[] = []

  if ("summary" in result && result.summary) {
    const s: any = result.summary

    rows.push({ label: "Total Income", value: s.totalIncome })
    rows.push({ label: "Total Deductions", value: s.totalDeductions })
    rows.push({ label: "Taxable Income", value: s.taxableIncome })
    rows.push({ label: "Tax Liability", value: s.taxLiability })
    rows.push({ label: "Effective Tax Rate", value: s.effectiveRate })
  } else {
    // Fallback for lightweight engine mode
    for (const [k, v] of Object.entries(result)) {
      if (typeof v !== "object") {
        rows.push({ label: k, value: v as any })
      }
    }
  }

  const header = "Field,Value"

  const body = rows
    .map((r: ReportRow) => `${escapeCSV(r.label)},${escapeCSV(r.value)}`)
    .join("\n")

  return `${header}\n${body}`
}
