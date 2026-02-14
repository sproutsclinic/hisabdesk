// ==========================================================
// HisabDesk — Profile Advisor (STUB ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Placeholder module so imports don't break.
//   No business logic yet.
//
// RULES
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
// ==========================================================

export interface ProfileAdvice {
  score?: number
  notes?: string[]
}

export function analyzeProfile(): ProfileAdvice {
  return {
    score: 0,
    notes: [],
  }
}
export { buildPortfolioAdvice as analyzePortfolio }