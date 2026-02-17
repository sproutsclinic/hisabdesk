ï»¿// ==========================================================
// Reports Types (Single Source of Truth)
// Shared across:
// - hook (client types only)
// - api routes
// - service
// - engine
//
// RULE:
// Only types/interfaces here.
// NO logic.
// ==========================================================

/* =========================================================
Core
========================================================= */

export type ReportRange = "7d" | "30d" | "90d" | "6m" | "1y" | "all"

/* =========================================================
Transactions (engine input shape)
========================================================= */

export type TransactionType = "income" | "expense"

export interface EngineTransaction {
  id: string
  type: TransactionType
  amount: number
  category: string | null
  date: string
}

/* =========================================================
Engine Input
========================================================= */

export interface ReportsEngineInput {
  from: string
  to: string
  transactions: EngineTransaction[]
}

/* =========================================================
Output DTO (API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Hook ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ UI)
========================================================= */

export interface KPIBlock {
  income: number
  expense: number
  savings: number
  savingsRate: number
  netCashflow: number
}

export interface CategoryBreakdown {
  category: string
  amount: number
  percent: number
}

export interface MonthlySeriesPoint {
  month: string
  income: number
  expense: number
  savings: number
}

export interface ReportsResult {
  kpis: KPIBlock
  incomeByCategory: CategoryBreakdown[]
  expenseByCategory: CategoryBreakdown[]
  monthlySeries: MonthlySeriesPoint[]
}

/* =========================================================
Service
========================================================= */

export interface GetReportsParams {
  userId: string
  range?: string
  from?: string
  to?: string
}

/* =========================================================
Hook
========================================================= */

export interface ReportsQuery {
  range?: ReportRange
  from?: string
  to?: string
}
