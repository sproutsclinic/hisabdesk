ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AI Assistant Quick Actions
// ----------------------------------------------------------
// PURPOSE
//   One-click AI actions for common finance tasks
//
//   Why:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ zero typing needed
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ higher engagement
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ faster insights
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ ideal for dashboard
//
//   Use cases:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Dashboard ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ "Quick AI Tips"
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Insights page
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Expense/Tax/Wealth sections
//
//   Example:
//
//     <AIAssistantQuickActions
//        context={{ income, expense, savingsRate }}
//     />
//
//   Works with:
//     useAIAssistant hook
//
// ==========================================================

import { Card } from "@/components/ui/card"
import { useAIAssistant } from "@/lib/hooks/useAIAssistant"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  context?: {
    income?: number
    expense?: number
    savingsRate?: number
    networth?: number
    runwayMonths?: number
    burnRisk?: "low" | "medium" | "high"
    goalsBehind?: number
    alerts?: number
  }
}

// ==========================================================
// QUICK PROMPTS
// ==========================================================

const ACTIONS = [
  {
    label: "Cut Expenses",
    prompt: "How can I reduce my monthly expenses?",
  },
  {
    label: "Improve Savings",
    prompt: "How can I improve my savings rate?",
  },
  {
    label: "Tax Tips",
    prompt: "How can I reduce my income tax legally?",
  },
  {
    label: "Investment Plan",
    prompt: "How should I allocate my investments?",
  },
]

// ==========================================================
// COMPONENT
// ==========================================================

export default function AIAssistantQuickActions({
  context,
}: Props) {
  const { ask, reply, loading } = useAIAssistant()

  async function run(prompt: string) {
    await ask(prompt, { context })
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="font-semibold text-sm">
        AI Quick Actions
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => run(a.prompt)}
            disabled={loading}
            className="
              text-xs px-3 py-1
              border rounded-full
              bg-muted hover:bg-muted/80
            "
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Reply */}
      {reply && (
        <div className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </Card>
  )
}
