ï»¿// ==========================================================
// Reports Service (Server only)
// Layer: API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Engine ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ DB
//
// Responsibilities:
// - orchestrates DB calls
// - delegates calculations to engine
// - returns DTO for API
//
// NO:
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ business math here
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ HTTP logic
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ UI logic
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import {
  buildReportsFromTransactions,
  type ReportsResult,
  type ReportsEngineInput,
} from "./reports.engine"

/* =========================================================
Types
========================================================= */

export type ReportRange = "7d" | "30d" | "90d" | "6m" | "1y" | "all"

export interface GetReportsParams {
  userId: string
  range?: string
  from?: string
  to?: string
}

/* =========================================================
Factory
========================================================= */

export function getReportsService() {
  return {
    getReports,
  }
}

/* =========================================================
Public API
========================================================= */

async function getReports(params: GetReportsParams): Promise<ReportsResult> {
  const supabase = getSupabaseAdmin()

  const { userId } = params

  // -------------------------------------------------------
  // Resolve date range (NO calculations, only boundaries)
  // -------------------------------------------------------

  const { from, to } = resolveDateWindow(params)

  // -------------------------------------------------------
  // Fetch transactions (single source of truth)
  // -------------------------------------------------------

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(
      `
        id,
        type,
        amount,
        category,
        date
      `
    )
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to)

  if (error) {
    throw new Error(error.message)
  }

  // -------------------------------------------------------
  // Engine (ALL calculations happen there)
  // -------------------------------------------------------

  const engineInput: ReportsEngineInput = {
    from,
    to,
    transactions: transactions ?? [],
  }

  return buildReportsFromTransactions(engineInput)
}

/* =========================================================
Helpers (boundary only, not business logic)
========================================================= */

function resolveDateWindow(params: GetReportsParams): {
  from: string
  to: string
} {
  const now = new Date()

  if (params.from && params.to) {
    return {
      from: params.from,
      to: params.to,
    }
  }

  const range = (params.range as ReportRange) ?? "30d"

  const to = now.toISOString()

  const fromDate = new Date(now)

  switch (range) {
    case "7d":
      fromDate.setDate(now.getDate() - 7)
      break
    case "30d":
      fromDate.setDate(now.getDate() - 30)
      break
    case "90d":
      fromDate.setDate(now.getDate() - 90)
      break
    case "6m":
      fromDate.setMonth(now.getMonth() - 6)
      break
    case "1y":
      fromDate.setFullYear(now.getFullYear() - 1)
      break
    case "all":
    default:
      fromDate.setFullYear(2000)
      break
  }

  return {
    from: fromDate.toISOString(),
    to,
  }
}
