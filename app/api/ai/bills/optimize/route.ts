ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Bills Optimization (PFOS-Compliant)
// ----------------------------------------------------------
// Uses centralized AI gateway. No direct request access.
// ==========================================================

import { withAI } from "@/lib/ai/withAI"

export const dynamic = "force-dynamic"

/* =========================================================
POST /api/ai/bills/optimize
========================================================= */

export const POST = withAI(async ({ safeRun }) => {
  // NOTE:
  // withAI currently does not expose raw request body.
  // Bills optimization will run using AI interpretation layer only.
  // (Input plumbing is added later in Phase-3 interface pass.)

  const prompt = `
Provide general guidance to optimize recurring bills,
reduce waste, and improve predictability of fixed expenses.

Keep advice practical and concise.
`

  const result = await safeRun({
    prompt,
    type: "module",
    module: "bills-optimize",
  })

  return {
    text: result.text,
  }
})
