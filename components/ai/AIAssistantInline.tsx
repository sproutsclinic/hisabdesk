"use client"

// ==========================================================
// HisabDesk — AI Assistant Inline (Embed Anywhere)
// ----------------------------------------------------------
// PURPOSE
//   Small inline AI assistant block for any page section
//
//   Difference vs FAB:
//     FAB      → floating quick help
//     Drawer   → full conversation
//     Inline   → page-specific insights
//
//   Use cases:
//     ✓ Dashboard card
//     ✓ Expense page tips
//     ✓ Tax optimizer helper
//     ✓ Wealth planner suggestions
//
//   Example:
//
//     <AIAssistantInline
//        title="Expense Tips"
//        placeholder="How can I cut costs?"
//        context={{ expense: 40000 }}
//     />
//
//   Clean, self-contained, reusable
// ==========================================================

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useAIAssistant } from "@/lib/hooks/useAIAssistant"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  title?: string
  placeholder?: string
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
// COMPONENT
// ==========================================================

export default function AIAssistantInline({
  title = "Ask AI",
  placeholder = "Ask a finance question…",
  context,
}: Props) {
  const { ask, reply, loading } = useAIAssistant()

  const [input, setInput] = useState("")

  // --------------------------------------------------------
  // SEND
  // --------------------------------------------------------

  async function handleAsk() {
    if (!input.trim()) return

    await ask(input, { context })
    setInput("")
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <Card className="p-4 space-y-3">
      <div className="font-semibold text-sm">{title}</div>

      {/* Reply */}
      {reply && (
        <div className="text-sm bg-muted p-2 rounded whitespace-pre-wrap">
          {reply}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm border rounded px-2 py-1"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="px-3 bg-primary text-white rounded text-sm"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </Card>
  )
}
