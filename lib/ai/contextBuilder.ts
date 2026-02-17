ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Context Builder
// ----------------------------------------------------------
// PURPOSE
//   Converts raw financial numbers ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ ultra-compact AI summary
//
//   Why this exists:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ keeps prompt tokens LOW
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ consistent format across app
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ prevents every page building its own strings
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ improves AI answer quality
//
//   RULE:
//     NEVER manually concatenate summary strings in pages
//     Always use this builder
//
// ==========================================================



// ==========================================================
// TYPES
// ==========================================================

export interface AIContextInput {
  income?: number
  expense?: number
  savingsRate?: number
  networth?: number
  assets?: number
  liabilities?: number
  runwayMonths?: number
  burnRate?: number
  burnRisk?: "low" | "medium" | "high"
  taxPayable?: number
  goalsBehind?: number
  alerts?: number
}



// ==========================================================
// HELPERS
// ==========================================================

function push(
  parts: string[],
  key: string,
  value?: number | string
) {
  if (value === undefined || value === null) return
  parts.push(`${key}=${value}`)
}



// ==========================================================
// CORE BUILDER (GLOBAL APP CONTEXT)
// ==========================================================

export function buildAIContext(
  data: AIContextInput
): string {
  const parts: string[] = []

  // money flow
  push(parts, "income", data.income)
  push(parts, "expense", data.expense)
  push(parts, "saveRate", data.savingsRate)

  // wealth
  push(parts, "networth", data.networth)
  push(parts, "assets", data.assets)
  push(parts, "liab", data.liabilities)

  // burn
  push(parts, "burn", data.burnRate)
  push(parts, "runway", data.runwayMonths)
  push(parts, "risk", data.burnRisk)

  // tax
  push(parts, "tax", data.taxPayable)

  // planner
  push(parts, "goalsBehind", data.goalsBehind)

  // alerts
  push(parts, "alerts", data.alerts)

  // --------------------------------------------------------
  // ultra compact single-line string
  // --------------------------------------------------------

  return parts.join(" ")
}



/* =========================================================
   =========================================================
   TAX CONTEXT BUILDER (ADDED ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â SAFE EXTENSION)
   ---------------------------------------------------------
   PURPOSE
   - Dedicated compact context for AI Tax Advisor
   - Keeps tokens VERY low
   - Consistent with your existing key=value style
   - Used by:
        /api/ai/tax
        tax insights
        planners

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI calls
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No formatting logic elsewhere
   ========================================================= */

import type { TaxComputationResult } from "@/lib/api/tax/types"

export function buildTaxContext(
  result: TaxComputationResult
): string {
  const parts: string[] = []

  const oldR = result.oldRegime
  const newR = result.newRegime

  // OLD
  push(parts, "oldTax", Math.round(oldR.totalTax))
  push(parts, "oldTaxable", Math.round(oldR.taxableIncome))
  push(parts, "oldDed", Math.round(oldR.totalDeductions))

  // NEW
  push(parts, "newTax", Math.round(newR.totalTax))
  push(parts, "newTaxable", Math.round(newR.taxableIncome))

  // summary
  push(parts, "rec", result.recommended)
  push(parts, "save", Math.round(result.savings))

  // ultra-compact
  // example:
  // oldTax=54000 newTax=61000 rec=old save=7000
  return parts.join(" ")
}
