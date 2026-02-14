/* =========================================================
   HisabDesk — LoansAIAdviceCard
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Show AI payoff / EMI optimization advice
   - Calls useLoansAI hook
   - Displays result
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI

   ARCHITECTURE
     page → LoansAIAdviceCard → useLoansAI → /api/ai/loans

   RULES
   ✅ UI only
   ✅ hook only
   ❌ no math
   ❌ no DB
   ❌ no OpenAI

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import { useLoansAI } from "@/hooks/useLoansAI"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function LoansAIAdviceCard() {
  const { run, loading, text, error } = useLoansAI()

  return (
    <Card className="p-6 space-y-4">
      {/* -----------------------------------------------------
         HEADER
         ----------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium">AI Payoff Advisor</h2>

        <button
          onClick={run}
          disabled={loading}
          className="text-xs px-3 py-1 border rounded hover:bg-muted disabled:opacity-50"
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
         RESULT
         ----------------------------------------------------- */}
      {text && (
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {text}
        </div>
      )}

      {/* -----------------------------------------------------
         EMPTY
         ----------------------------------------------------- */}
      {!text && !loading && (
        <div className="text-sm text-muted-foreground">
          Get personalized suggestions to reduce interest and
          repay loans faster.
        </div>
      )}
    </Card>
  )
}
