// ==========================================================
// HisabDesk — AI Budget Enforcer (Cost Protection Core)
// ----------------------------------------------------------
// PURPOSE
//   Central monthly AI budget protection logic
//
//   This is the SINGLE source of truth for:
//
//     ✓ monthly token usage
//     ✓ dollar estimation
//     ✓ remaining balance
//     ✓ allow / block decisions
//
//   Used by:
//     ✓ guard.ts
//     ✓ usage routes
//     ✓ health route
//
//   So cost math NEVER spreads across files.
//
// ==========================================================

import { createClient } from "@/lib/supabase"
import { AI_COST } from "./constants"

// ==========================================================
// CLIENT
// ==========================================================

const supabase = createClient()

// ==========================================================
// TYPES
// ==========================================================

export interface BudgetStatus {
  usedTokens: number
  usedDollars: number
  remainingDollars: number
  limit: number
  allowed: boolean
}

// ==========================================================
// INTERNAL
// ==========================================================

function startOfMonthISO() {
  const now = new Date()

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString()
}

// ==========================================================
// CORE CALCULATIONS
// ==========================================================

export async function getUserTokenUsage(
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from("ai_logs")
    .select("tokens")
    .eq("user_id", userId)
    .gte("created_at", startOfMonthISO())

  return (data || []).reduce(
    (sum, r) => sum + (r.tokens || 0),
    0
  )
}

export function tokensToDollars(tokens: number) {
  return (tokens / 1000) * AI_COST.COST_PER_1K_TOKENS
}

// ==========================================================
// PUBLIC API
// ==========================================================

export async function getBudgetStatus(
  userId: string
): Promise<BudgetStatus> {
  const usedTokens = await getUserTokenUsage(userId)

  const usedDollars = tokensToDollars(usedTokens)

  const remaining =
    AI_COST.MONTHLY_LIMIT_DOLLARS - usedDollars

  return {
    usedTokens,
    usedDollars,
    remainingDollars: Math.max(0, remaining),
    limit: AI_COST.MONTHLY_LIMIT_DOLLARS,
    allowed: remaining > 0,
  }
}

// ==========================================================
// THROW IF EXCEEDED (used by guard)
// ==========================================================

export async function enforceBudget(userId: string) {
  const status = await getBudgetStatus(userId)

  if (!status.allowed) {
    throw new Error(
      "Monthly AI usage limit reached. Try next month or upgrade."
    )
  }

  return status
}
