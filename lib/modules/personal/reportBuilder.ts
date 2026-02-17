ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Report Builder (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Build consolidated financial snapshot for UI + AI + export
//
//   This aggregates outputs from all advisors into ONE object.
//   Think of this as:
//
//     "Personal Financial State Snapshot"
//
//   Pages call this ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ get everything at once.
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - dashboard
//   - insights
//   - AI routes
//   - exports
// ==========================================================

// ==========================================================
// IMPORT ADVISORS
// ==========================================================

import { CashflowAdvice } from "./cashflowAdvisor"
import { SavingsAdvice } from "./savingsAdvisor"
import { NetworthAdvice } from "./networthAdvisor"
import { BudgetSummary } from "./budgetAdvisor"
import { GoalsSummary } from "./goalAdvisor"
import { Alert } from "./alertEngine"

// ==========================================================
// TYPES
// ==========================================================

export interface FinancialReportInput {
  cashflow?: CashflowAdvice
  savings?: SavingsAdvice
  networth?: NetworthAdvice
  budgets?: BudgetSummary
  goals?: GoalsSummary
  alerts?: Alert[]
}

export interface FinancialReport {
  // money
  income: number
  expense: number
  savings: number
  savingsRate: number

  // wealth
  networth: number
  liquidityMonths: number

  // risk
  burnRisk?: string
  health?: string

  // goals
  goalsBehind: number

  // alerts
  alertCount: number
}

// ==========================================================
// CORE BUILDER
// ==========================================================

export function buildFinancialReport(
  input: FinancialReportInput
): FinancialReport {
  const income = input.cashflow?.avgIncome ?? 0
  const expense = input.cashflow?.avgExpense ?? 0
  const savings = input.cashflow?.avgSavings ?? 0
  const savingsRate = input.cashflow?.savingsRate ?? 0

  const networth = input.networth?.networth ?? 0
  const liquidityMonths = input.networth?.liquidityMonths ?? 0

  const goalsBehind =
    input.goals?.advices.filter(
      (g) => g.status === "behind"
    ).length ?? 0

  const alertCount = input.alerts?.length ?? 0

  return {
    income,
    expense,
    savings,
    savingsRate,

    networth,
    liquidityMonths,

    burnRisk: input.cashflow?.expenseRisk,
    health: input.networth?.health,

    goalsBehind,
    alertCount,
  }
}
