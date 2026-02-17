ï»¿/* =========================================================
HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Tax Advice API (PFOS-Compliant)
----------------------------------------------

Uses stored tax computation results.
Never recalculates tax.
AI interprets latest financial truth only.
========================================================= */

import { withAI } from "@/lib/ai/withAI"
import { getLatestTaxCalculation } from "@/lib/api/tax/service"

export const dynamic = "force-dynamic"

export const POST = withAI(async ({ user, safeRun }) => {
// -------------------------------------------------------
// Load latest computed tax result (already calculated)
// -------------------------------------------------------

const currentFY = new Date().getFullYear().toString()

const latest = await getLatestTaxCalculation(user.id, currentFY)

if (!latest) {
return {
insights: "Run tax calculation first to receive advice.",
}
}

const result = latest.result

const prompt = `
Tax Metrics:
recommended=${result.recommended}
oldTax=${result.oldRegime.totalTax}
newTax=${result.newRegime.totalTax}
difference=${Math.abs(
result.oldRegime.totalTax - result.newRegime.totalTax,
)}

Provide 4 concise India-specific tax planning actions.
Use only the numbers provided.
Do not assume additional deductions.
`

const ai = await safeRun({
prompt,
type: "module",
module: "tax-advice",
})

return { insights: ai.text }
})
