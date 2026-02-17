ï»¿// ==========================================================
// Insights Service (Domain Aggregator)
// Layer: API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Service (THIS FILE) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Other Domain Services
//
// PURPOSE
// - Compose cross-domain financial picture
// - Provide structured data for AI layer
// - No financial math here
// - No DB queries here (delegated to services)
//
// This is the PFOS orchestration layer.
// ==========================================================

import { getReportsService } from "@/lib/api/reports/reports.service"
import { getPortfolioService } from "@/lib/api/portfolio/portfolio.service"
import { getWealthService } from "@/lib/api/wealth/wealth.service"

import type { ReportsResult } from "@/lib/api/reports/reports.engine"

/* =========================================================
LOCAL CONTRACT TYPES (DO NOT IMPORT FROM WEALTH)
This file OWNS the Insights DTO during Phase-H stabilization.
========================================================= */

type PortfolioOverview = {
  totalValue: number
  totalHoldings: number
  breakdown: any[]
}

type WealthProjectionResult = {
  projected5y: number
  projected10y: number
  assumedReturn: number
}

type RetirementResult = {
  currentNetWorth: number
  estimatedMonthlyIncome: number
}

/* =========================================================
AI-READY SNAPSHOT (Single PFOS View)
========================================================= */

export interface InsightsSnapshot {
  generatedAt: string

  cashflow: ReportsResult
  portfolio: PortfolioOverview
  projection: WealthProjectionResult
  retirement: RetirementResult

  signals: {
    savingsRate?: number
    investmentRatio?: number
    expensePressure?: number
  }
}

export interface GetInsightsParams {
  userId: string
  range?: "30d" | "90d" | "1y" | "all"
}

/* =========================================================
Factory
========================================================= */

export function getInsightsService() {
  return {
    getInsightsSnapshot,
  }
}

/* =========================================================
Public API
========================================================= */

async function getInsightsSnapshot(
  params: GetInsightsParams,
): Promise<InsightsSnapshot> {
  const reportsService = getReportsService()
  const portfolioService = getPortfolioService()
  const wealthService = getWealthService()

  // -------------------------------------------------------
  // Resolve core domains in parallel
  // -------------------------------------------------------

  const [cashflow, portfolio] = await Promise.all([
    reportsService.getReports({
      userId: params.userId,
      range: params.range ?? "90d",
    }),
    portfolioService.getPortfolioOverview(params.userId),
  ])

  // -------------------------------------------------------
  // Wealth depends on portfolio ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ sequential
  // -------------------------------------------------------

  const projectionRaw = await wealthService.projectFromPortfolio({
    userId: params.userId,
    currentValue: portfolio.totalValue,
  })

  const retirementRaw = await wealthService.estimateRetirement(
    params.userId,
  )

  // -------------------------------------------------------
  // ADAPT wealth module ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ insights contract
  // (This is the boundary translation layer)
  // -------------------------------------------------------

  const projection: WealthProjectionResult = {
    projected5y: projectionRaw.projected5y ?? 0,
    projected10y: projectionRaw.projected10y ?? 0,
    assumedReturn: projectionRaw.assumedReturn ?? 0,
  }

  const retirement: RetirementResult = {
    currentNetWorth: retirementRaw.currentNetWorth ?? 0,
    estimatedMonthlyIncome:
      retirementRaw.estimatedMonthlyIncome ?? 0,
  }

  const signals = deriveSignals(cashflow, portfolio)

  return {
    generatedAt: new Date().toISOString(),
    cashflow,
    portfolio,
    projection,
    retirement,
    signals,
  }
}

/* =========================================================
Behavioural Signals (Allowed Lightweight Interpretation)
========================================================= */

function deriveSignals(
  reports: ReportsResult,
  portfolio: PortfolioOverview,
) {
  // ReportsResult already contains flattened values
  const income = (reports as any).totalIncome ?? 0
  const expense = (reports as any).totalExpense ?? 0

  const savings = income - expense

  const savingsRate =
    income > 0 ? Number((savings / income).toFixed(2)) : 0

  const investmentRatio =
    income > 0
      ? Number((portfolio.totalValue / income).toFixed(2))
      : 0

  const expensePressure =
    income > 0 ? Number((expense / income).toFixed(2)) : 0

  return {
    savingsRate,
    investmentRatio,
    expensePressure,
  }
}
