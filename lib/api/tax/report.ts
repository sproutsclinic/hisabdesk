/* =========================================================
   HisabDesk — Tax Report Builder
   ---------------------------------------------------------
   PURPOSE
   - Convert tax results → exportable formats
   - CSV
   - tabular rows
   - future PDF adapter

   RULES
   ✅ PURE FUNCTIONS ONLY
   ✅ NO DB
   ✅ NO AI
   ✅ NO SIDE EFFECTS
   ✅ Deterministic

   Used by:
     app/api/tax/export/*
     reports
     downloads
     email summaries

   Layer:
     service → report → file generator

   ========================================================= */

import type {
  TaxComputationResult,
  TaxReportRow,
} from "./types"

/* =========================================================
   HELPERS
   ========================================================= */

function currency(n: number): number {
  return Math.round(n || 0)
}

function percent(n: number): string {
  return `${(n * 100).toFixed(2)}%`
}

/* =========================================================
   ROW BUILDER (structured)
   ========================================================= */

export function buildTaxalaxReportRows(
  result: TaxComputationResult,
): TaxReportRow[] {
  const oldR = result.oldRegime
  const newR = result.newRegime

  return [
    /* ---------------- SUMMARY ---------------- */
    { label: "Recommended Regime", value: result.recommended.toUpperCase() },
    { label: "Tax Savings", value: currency(result.savings) },

    /* ---------------- OLD ---------------- */
    { label: "Old Regime — Gross Income", value: currency(oldR.grossIncome) },
    { label: "Old Regime — Deductions", value: currency(oldR.totalDeductions) },
    { label: "Old Regime — Taxable Income", value: currency(oldR.taxableIncome) },
    { label: "Old Regime — Tax Before Cess", value: currency(oldR.taxBeforeCess) },
    { label: "Old Regime — Total Tax", value: currency(oldR.totalTax) },
    { label: "Old Regime — Effective Rate", value: percent(oldR.effectiveRate) },

    /* ---------------- NEW ---------------- */
    { label: "New Regime — Gross Income", value: currency(newR.grossIncome) },
    { label: "New Regime — Taxable Income", value: currency(newR.taxableIncome) },
    { label: "New Regime — Tax Before Cess", value: currency(newR.taxBeforeCess) },
    { label: "New Regime — Total Tax", value: currency(newR.totalTax) },
    { label: "New Regime — Effective Rate", value: percent(newR.effectiveRate) },
  ]
}

/* =========================================================
   CSV GENERATOR
   ========================================================= */

export function buildTaxCSV(result: TaxComputationResult): string {
  const rows = buildTaxReportRows(result)

  const header = "Metric,Value"

  const body = rows
    .map((r) => `${escapeCSV(r.label)},${escapeCSV(String(r.value))}`)
    .join("\n")

  return `${header}\n${body}`
}

/* =========================================================
   TABLE DATA (for UI preview)
   ========================================================= */

export function buildTaxTable(result: TaxComputationResult) {
  const rows = buildTaxReportRows(result)

  return rows.map((r) => ({
    metric: r.label,
    value: r.value,
  }))
}

/* =========================================================
   INTERNAL
   ========================================================= */

function escapeCSV(text: string) {
  if (text.includes(",") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

/* =========================================================
   FIX: typo-safe alias (backward compatibility if needed)
   ========================================================= */

export const buildTaxReportRows = buildTaxReportRows
