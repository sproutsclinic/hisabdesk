ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AutomationAIAdviceCard
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Show AI optimization advice for recurring rules
   - Calls useAutomationAI hook
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI

   ARCHITECTURE
     Component ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ useAutomationAI ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ /api/ai/automation/advice

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ UI only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no AI SDK
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no DB
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no math

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"
import { useAutomationAI } from "@/hooks/useAutomationAI"

/* =========================================================
   COMPONENT
   ========================================================= */

export default function AutomationAIAdviceCard() {
  const { loading, error, text, getAdvice, reset } =
    useAutomationAI()

  return (
    <Card className="p-6 space-y-4">
      {/* --------------------------------------------------- */}
      {/* HEADER */}
      {/* --------------------------------------------------- */}

      <div className="flex items-center justify-between">
        <h2 className="font-medium">AI Advisor</h2>

        <div className="flex gap-2">
          {!text && (
            <button
              onClick={getAdvice}
              disabled={loading}
              className="px-3 py-1 text-sm rounded bg-black text-white disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Get Advice"}
            </button>
          )}

          {text && (
            <button
              onClick={reset}
              className="px-3 py-1 text-xs border rounded"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------- */}
      {/* ERROR */}
      {/* --------------------------------------------------- */}

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {/* --------------------------------------------------- */}
      {/* CONTENT */}
      {/* --------------------------------------------------- */}

      {!text && !loading && (
        <div className="text-sm text-muted-foreground">
          Get smart suggestions to reduce fixed expenses,
          optimize subscriptions, and improve monthly cashflow.
        </div>
      )}

      {loading && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Generating personalized advice...
        </div>
      )}

      {text && (
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {text}
        </div>
      )}
    </Card>
  )
}
