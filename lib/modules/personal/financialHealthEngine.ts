// ==========================================================
// HisabDesk — Financial Health Engine (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   FINAL orchestration layer for Personal module
//
//   Combines:
//     • advisors
//     • aggregators
//     • score engine
//     • alerts
//
//   Returns ONE complete "Financial Health Snapshot"
//
//   This becomes:
//     - dashboard data source
//     - AI context source
//     - insights page source
//
//   👉 Pages should call THIS, not 10 different modules
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
// ==========================================================

// ==========================================================
// IMPORT ENGINES
// ==========================================================

import { AggregatedMetrics } from "./metricsAggregator"
import {
  calculateFinancialScore,
  FinancialScoreResult,
} from "./financialScore"
import { buildAlerts, Alert } from "./alertEngine"

// ==========================================================
// TYPES
// ==========================================================

export interface HealthEngineInput {
  metrics: AggregatedMetrics
}

export interface FinancialHealthSnapshot {
  metrics: AggregatedMetrics
  score: FinancialScoreResult
  alerts: Alert[]
}

// ==========================================================
// CORE ENGINE
// ==========================================================

export function buildFinancialHealthSnapshot(
  input: HealthEngineInput
): FinancialHealthSnapshot {
  const m = input.metrics

  // --------------------------------------------------------
  // Financial score
  // --------------------------------------------------------

  const score = calculateFinancialScore({
    savingsRate: m.savingsRate,
    runwayMonths: m.runwayMonths,
    debtRatio:
      m.networth > 0
        ? 0 // placeholder if debt ratio not provided
        : 1,
    goalsBehind: m.goalsBehind,
    overspendCategories: 0, // optional future hook
  })

  // --------------------------------------------------------
  // Alerts
  // --------------------------------------------------------

  const alerts = buildAlerts({
    savingsRate: m.savingsRate,
    burnRisk: m.burnRisk as any,
    runwayMonths: m.runwayMonths,
    goalBehindCount: m.goalsBehind,
    networthTrend: m.networthTrend,
  })

  return {
    metrics: m,
    score,
    alerts,
  }
}
