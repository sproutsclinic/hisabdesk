// ==========================================================
// HisabDesk — AI Route Template (REFERENCE ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Canonical template for ALL future AI routes
//
//   DO NOT import this directly.
//   Copy this file when creating a new AI endpoint.
//
//   This enforces:
//     ✓ withAI wrapper
//     ✓ safeRun usage
//     ✓ zero duplicate auth
//     ✓ zero duplicate logging
//     ✓ rate-limit protection
//
// ==========================================================

import { withAI } from "@/lib/ai"

// ==========================================================
// POST
// ==========================================================

export const POST = withAI(async ({ user, safeRun }, req) => {
  // --------------------------------------------------------
  // 1. Read request body (if needed)
  // --------------------------------------------------------

  const body = await req.json().catch(() => ({}))

  // --------------------------------------------------------
  // 2. Build compact prompt (VERY IMPORTANT)
  //    Keep tokens minimal
  // --------------------------------------------------------

  const prompt = `
Example Metrics:
value=${body.value ?? 0}

Give short financial advice only.
`

  // --------------------------------------------------------
  // 3. Safe AI call (MANDATORY)
  // --------------------------------------------------------

  const result = await safeRun({
    prompt,
    type: "module", // module | chat | heavy
    module: "example-module",
  })

  // --------------------------------------------------------
  // 4. Return JSON only
  // --------------------------------------------------------

  return {
    insights: result.text,
  }
})
