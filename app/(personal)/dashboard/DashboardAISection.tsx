"use client"

// ==========================================================
// HisabDesk — Dashboard AI Section (Unified AI Block)
// ----------------------------------------------------------
// PURPOSE
//   Single reusable AI section for Dashboard
//
//   Combines:
//     ✓ Rule alerts (free + instant)
//     ✓ AI insights (smart summary)
//     ✓ Inline AI assistant (questions)
//
//   Why this exists:
//     ✓ keeps page.tsx clean
//     ✓ AI becomes integral (not scattered)
//     ✓ one drop-in component
//
//   Architecture:
//     AlertsCard          → deterministic
//     AIInsightsCard      → GPT summary
//     DashboardAIInline   → interactive Q&A
//
//   Usage:
//
//     <DashboardAISection
//        income={income}
//        expense={expense}
//        networth={savings}
//        savingsRate={savingsRate}
//     />
//
// ==========================================================

import AlertsCard from "./AlertsCard"
import AIInsightsCard from "./AIInsightsCard"
import DashboardAIInline from "@/components/ai/DashboardAIInline"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  income: number
  expense: number
  networth: number
  savingsRate: number
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function DashboardAISection({
  income,
  expense,
  networth,
  savingsRate,
}: Props) {
  return (
    <div className="space-y-4">

      {/* -------------------------------------------------- */}
      {/* Rule-based alerts (free) */}
      {/* -------------------------------------------------- */}
      <AlertsCard />

      {/* -------------------------------------------------- */}
      {/* AI summary insights */}
      {/* -------------------------------------------------- */}
      <AIInsightsCard
        income={income}
        expense={expense}
        networth={networth}
        savingsRate={savingsRate}
      />

      {/* -------------------------------------------------- */}
      {/* Inline AI assistant */}
      {/* -------------------------------------------------- */}
      <DashboardAIInline />

    </div>
  )
}
