// ==========================================================
// HisabDesk — Metrics Aggregator (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Single place to aggregate ALL financial numbers
//   into one normalized metrics object
//
//   Why this file:
//   - prevents pages from manually stitching data
//   - avoids duplicated calculations
//   - provides ONE source of truth for dashboard + AI
//
//   Flow:
//     DB (lib/api) → advisors → aggregator → UI/AI
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
// ==========================================================

// ==========================================================
// IMPORT TYPES FROM ADVISORS
// ==========================================================

import { CashflowAdvice } from "./cashflowAdvisor"
import { SavingsAdvice } from "./savingsAdvisor"
import { NetworthAdvice } from "./networthAdvisor"
import { GoalsSummary } from "./goalAdvisor"
import { Alert } from "./alertEngine"

// ==========================================================
// TYPES
// ==========================================================

export interface AggregatedMetrics {
  // money
  income: number
  expense: number
  savings: number
  savingsRate: number

  // wealth
  networth: number
  liquidityMonths: number
  networthTrend?: "up" | "down" | "flat"

  // risk
  burnRisk?: string
  runwayMonths: number

  // goals
  goalsBehind: number

  // alerts
  alertCount: number
}

// ==========================================================
// CORE AGGREGATOR
// ==========================================================

export function aggregateMetrics(params: {
  cashflow?: CashflowAdvice
  savings?: SavingsAdvice
  networth?: NetworthAdvice
  goals?: GoalsSummary
  alerts?: Alert[]
}): AggregatedMetrics {
  const income = params.cashflow?.avgIncome ?? 0
  const expense = params.cashflow?.avgExpense ?? 0
  const savings = params.cashflow?.avgSavings ?? 0

  const savingsRate =
    params.savings?.savingsRate ??
    params.cashflow?.savingsRate ??
    0

  const networth = params.networth?.networth ?? 0
  const liquidityMonths =
    params.networth?.liquidityMonths ?? 0

  const runwayMonths = params.cashflow
    ? liquidityMonths // runway is liquidity proxy
    : 0

  const burnRisk = params.cashflow?.expenseRisk
  const networthTrend = params.networth?.trend

  const goalsBehind =
    params.goals?.advices.filter(
      (g) => g.status === "behind"
    ).length ?? 0

  const alertCount = params.alerts?.length ?? 0

  return {
    income,
    expense,
    savings,
    savingsRate,

    networth,
    liquidityMonths,
    networthTrend,

    burnRisk,
    runwayMonths,

    goalsBehind,
    alertCount,
  }
}
