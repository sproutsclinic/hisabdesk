/* =========================================================
   HisabDesk — Portfolio Report Builder
   ---------------------------------------------------------
   SERVER ONLY

   PURPOSE
   - Build exportable portfolio reports
   - CSV generation
   - future: PDF
   - ZERO business logic
   - ZERO calculations
   - formatting only

   ARCHITECTURE
     route → service → engine (computed values)
                         ↓
                     report.ts (THIS FILE)

   RULES
   ✅ formatting only
   ❌ no DB
   ❌ no AI
   ❌ no math logic

   ========================================================= */

import type {
  PortfolioOverview,
  PortfolioAssetComputed,
} from "./types"

/* =========================================================
   HELPERS
   ========================================================= */

function currency(n: number) {
  return Math.round(n ?? 0)
}

function percent(n: number) {
  return Number((n ?? 0).toFixed(2))
}

/* =========================================================
   CSV — HOLDINGS
   ========================================================= */

export function buildPortfolioCSV(
  overview: PortfolioOverview,
): string {
  const rows: PortfolioAssetComputed[] =
    overview.assets || []

  const lines: string[] = []

  /* -------------------------------------------------------
     HEADER
     ------------------------------------------------------- */

  lines.push(
    [
      "Name",
      "Type",
      "Quantity",
      "Buy Price",
      "Current Price",
      "Invested Value",
      "Current Value",
      "Profit/Loss",
      "Return %",
      "Allocation %",
    ].join(","),
  )

  /* -------------------------------------------------------
     ROWS
     ------------------------------------------------------- */

  for (const a of rows) {
    lines.push(
      [
        a.name,
        a.type,
        a.quantity,
        currency(a.buyPrice),
        currency(a.currentPrice),
        currency(a.investedValue),
        currency(a.currentValue),
        currency(a.profitLoss),
        percent(a.returnPercent),
        percent(a.allocationPercent),
      ].join(","),
    )
  }

  /* -------------------------------------------------------
     SUMMARY
     ------------------------------------------------------- */

  const s = overview.summary

  lines.push("") // spacer
  lines.push("SUMMARY")
  lines.push(`Total Invested,${currency(s.totalInvested)}`)
  lines.push(`Current Value,${currency(s.totalCurrent)}`)
  lines.push(`Profit/Loss,${currency(s.totalPnL)}`)
  lines.push(`Return %,${percent(s.totalReturnPercent)}`)

  /* -------------------------------------------------------
     FINAL
     ------------------------------------------------------- */

  return lines.join("\n")
}
