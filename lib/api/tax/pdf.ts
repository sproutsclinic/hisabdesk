ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Tax PDF Builder (Route-Compatible Version)
   ---------------------------------------------------------
   PURPOSE
   Provide a binary buffer for download endpoint.
   This is NOT a real PDF renderer yet ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â it creates a
   clean text-based document buffer (Phase-H safe stub).

   This keeps architecture intact while satisfying:
   ? route contract
   ? type safety
   ? future upgrade path to real PDF engine
   ========================================================= */

import type { TaxComputationResult } from "./types"
import { buildTaxCSV } from "./report"

/* =========================================================
   PUBLIC API ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â must match route usage
   route expects: buildTaxPDF(result, financialYear)
   and must return a Buffer
   ========================================================= */

export function buildTaxPDF(
  result: TaxComputationResult,
  financialYear?: string,
): Buffer {
  const title = `HISABDESK TAX REPORT${financialYear ? " ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â " + financialYear : ""}`
  const generatedAt = `Generated: ${new Date().toISOString()}`

  const body = buildTaxCSV(result)

  const document = [
    title,
    generatedAt,
    "----------------------------------------",
    body,
  ].join("\n\n")

  // Return binary buffer (route converts to Uint8Array)
  return Buffer.from(document, "utf-8")
}
