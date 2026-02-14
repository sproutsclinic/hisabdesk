"use client"

// ==========================================================
// HisabDesk — useAIShortcuts Hook
// ----------------------------------------------------------
// PURPOSE
//   Centralized predefined AI prompts for the whole app
//
//   Why:
//     ✓ avoid hardcoding strings in components
//     ✓ consistent phrasing → better AI quality
//     ✓ easy future localization
//     ✓ single place to edit
//
//   Used by:
//     ✓ Assistant tips
//     ✓ Dashboard quick actions
//     ✓ Voice/command palette (future)
//
//   Example:
//
//     const { shortcuts } = useAIShortcuts()
//     ask(shortcuts.reduceExpense)
//
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface AIShortcutMap {
  reduceExpense: string
  improveSavings: string
  taxOptimization: string
  investmentAdvice: string
  overspending: string
  emergencyFund: string
  retirementPlan: string
}

// ==========================================================
// HOOK
// ==========================================================

export function useAIShortcuts() {
  const shortcuts: AIShortcutMap = {
    reduceExpense:
      "How can I reduce my monthly expenses based on my spending?",

    improveSavings:
      "How can I improve my savings rate?",

    taxOptimization:
      "How can I legally reduce my income tax this year in India?",

    investmentAdvice:
      "How much should I invest monthly and where should I allocate it?",

    overspending:
      "Which categories am I overspending and how to control them?",

    emergencyFund:
      "How big should my emergency fund be?",

    retirementPlan:
      "Am I on track for retirement and what should I change?",
  }

  const list = Object.values(shortcuts)

  return {
    shortcuts,
    list,
  }
}
