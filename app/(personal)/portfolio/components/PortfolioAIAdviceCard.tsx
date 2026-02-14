/* =========================================================
   HisabDesk — PortfolioAIAdviceCard
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Display AI rebalance advice
   - Calls usePortfolioAI hook
   - Pure presentation + trigger
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI

   ARCHITECTURE
     UI → usePortfolioAI → /api/ai/portfolio/rebalance

   RULES
   ✅ client fetch only
   ❌ no AI calls directly
   ❌ no DB
   ❌ no math

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import { usePortfolioAI } from "@/hooks/usePortfolio"
/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioAIAdviceCard() {
  const { loading, error, text, getAdvice } =
    usePortfolioAI()

  return (
    <Card className="p-6 space-y-4 rounded-2xl shadow-sm">
      {/* -----------------------------------------------------
         HEADER
         ----------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          AI Rebalance Advisor
        </h3>

        <button
          onClick={getAdvice}
          disabled={loading}
          className="text-xs px-3 py-1 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Get Advice"}
        </button>
      </div>

      {/* -----------------------------------------------------
         ERROR
         ----------------------------------------------------- */}
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {/* -----------------------------------------------------
         CONTENT
         ----------------------------------------------------- */}
      {!text && !loading && !error && (
        <div className="text-sm text-muted-foreground">
          Click “Get Advice” to receive diversification and
          rebalance suggestions for your portfolio.
        </div>
      )}

      {text && (
        <div className="text-sm whitespace-pre-line leading-relaxed">
          {text}
        </div>
      )}
    </Card>
  )
}
