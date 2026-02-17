ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Bills Intelligence Route (PFOS-Compliant)
// ----------------------------------------------------------
// Route = Adapter only.
// Domain owns data.
// AI layer owns model execution.
// ==========================================================

import { withAI } from "@/lib/ai/withAI"
import { getAutomationOverview } from "@/lib/api/automation/service"

export const dynamic = "force-dynamic"

/* =========================================================
POST /api/ai/bills
========================================================= */

export const POST = withAI(async ({ user, safeRun }) => {
  // -------------------------------------------------------
  // Domain fetch (DB handled inside service layer)
  // -------------------------------------------------------

  const overview = await getAutomationOverview(user.id)

  const rules = overview.rules
  const monthlyExpense = overview.summary.monthlyExpense
  const netImpact = overview.summary.netMonthlyImpact

  // -------------------------------------------------------
  // Lightweight formatting (NOT business logic)
  // -------------------------------------------------------

  const compact = rules
    .map(r => `${r.name}:${r.amount}:${r.frequency}`)
    .join("|")

  const prompt = `
Bills Snapshot:

monthlyExpense=${monthlyExpense}
netImpact=${netImpact}
rules=${compact}

Task:
Suggest ways to optimize recurring bills,
reduce waste, and improve predictability.

Rules:
Use only provided data.
Do not assume anything.
Keep concise.
`

  // -------------------------------------------------------
  // Centralized AI Execution
  // -------------------------------------------------------

  const result = await safeRun({
    prompt,
    type: "module",
    module: "bills-intelligence",
  })

  return {
    text: result.text,
  }
})
