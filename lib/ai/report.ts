ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Usage Report Builder
// ----------------------------------------------------------
// PURPOSE
//   Converts raw ai_logs ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ clean report object for UI
//
//   This is the FINAL presentation layer for AI metrics.
//
//   Flow:
//     DB logs ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ metrics.ts ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ report.ts ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ UI
//
//   Keeps:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ routes thin
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ UI simple
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ consistent formatting
//
//   PURE LOGIC (no DB)
// ==========================================================

import type { AILogRow } from "./metrics"
import { computeAIMetrics } from "./metrics"
import { AI_COST } from "./constants"

// ==========================================================
// TYPES
// ==========================================================

export interface AIUsageReport {
  summary: {
    totalTokens: number
    totalCost: number
    remainingBudget: number
    projectedMonthlyCost: number
    status: "healthy" | "warning" | "limit"
  }

  modules: {
    module: string
    tokens: number
    cost: number
    percent: number
  }[]
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Number(n.toFixed(2))
}

function tokensToCost(tokens: number) {
  return (tokens / 1000) * AI_COST.COST_PER_1K_TOKENS
}

// ==========================================================
// CORE REPORT BUILDER
// ==========================================================

export function buildAIUsageReport(
  rows: AILogRow[]
): AIUsageReport {
  const metrics = computeAIMetrics(rows)

  const remaining =
    AI_COST.MONTHLY_LIMIT_DOLLARS - metrics.totalCost

  // --------------------------------------------------------
  // health status
  // --------------------------------------------------------

  let status: AIUsageReport["summary"]["status"] =
    "healthy"

  const usageRatio =
    metrics.totalCost / AI_COST.MONTHLY_LIMIT_DOLLARS

  if (usageRatio >= 1) status = "limit"
  else if (usageRatio >= 0.7) status = "warning"

  // --------------------------------------------------------
  // module breakdown
  // --------------------------------------------------------

  const modules = Object.entries(metrics.byModule)
    .map(([module, tokens]) => ({
      module,
      tokens,
      cost: round(tokensToCost(tokens)),
      percent:
        metrics.totalTokens === 0
          ? 0
          : Math.round(
              (tokens / metrics.totalTokens) * 100
            ),
    }))
    .sort((a, b) => b.tokens - a.tokens)

  // --------------------------------------------------------
  // result
  // --------------------------------------------------------

  return {
    summary: {
      totalTokens: metrics.totalTokens,
      totalCost: metrics.totalCost,
      remainingBudget: round(Math.max(0, remaining)),
      projectedMonthlyCost: metrics.projectedMonthlyCost,
      status,
    },
    modules,
  }
}
