ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â TaxAIAdviceCard
   UI ONLY COMPONENT
   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ FIXED PATH (file is useTax.ts) */
import { useTaxAI } from "@/hooks/useTax"

interface Props {
  financialYear?: string
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TaxAIAdviceCard({
  financialYear = "2024-25",
}: Props) {
  const { loading, error, message, getAdvice } = useTaxAI(financialYear)

  return (
    <Card className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">AI Tax Advisor</h3>
          <p className="text-xs text-muted-foreground">
            Personalized savings + compliance suggestions
          </p>
        </div>

        <button
          onClick={getAdvice}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Get Advice"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-500 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!message && !loading && !error && (
        <div className="text-sm text-muted-foreground">
          Run your tax calculation first, then click{" "}
          <span className="font-medium">Get Advice</span>.
        </div>
      )}

      {/* RESULT */}
      {message && (
        <div className="whitespace-pre-wrap text-sm leading-relaxed border rounded p-4 bg-muted/30">
          {message}
        </div>
      )}
    </Card>
  )
}
