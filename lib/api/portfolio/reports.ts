ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Portfolio Report Builder
   ---------------------------------------------------------
   Formatting layer only (NO DB / NO calculations)
   ========================================================= */

import type {
  PortfolioOverview,
  PortfolioAssetComputed,
} from "./types"

/* ========================================================= */

function currency(n: number) {
  return Math.round(n ?? 0)
}

function percent(n: number) {
  return Number((n ?? 0).toFixed(2))
}

/* =========================================================
   CSV Builder
   ========================================================= */

export function buildPortfolioCSV(
  overview: PortfolioOverview,
): string {
  const rows: PortfolioAssetComputed[] = overview.assets || []

  const lines: string[] = []

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

  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Domain model uses hybrid naming:
  // DB sourced ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ snake_case
  // computed ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ camelCase

  for (const a of rows) {
    lines.push(
      [
        a.name,
        a.type,
        a.quantity,

        // raw fields (from DB snapshot)
        currency(a.buy_price),
        currency(a.current_price),

        // computed fields (from engine)
        currency(a.investedValue),
        currency(a.currentValue),
        currency(a.profitLoss),
        percent(a.returnPercent),
        percent(a.allocationPercent),
      ].join(","),
    )
  }

  const s = overview.summary

  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ summary is computed ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ camelCase
  lines.push("")
  lines.push("SUMMARY")
  lines.push(`Total Invested,${currency(s.totalInvested)}`)
  lines.push(`Current Value,${currency(s.totalCurrent)}`)
  lines.push(`Profit/Loss,${currency(s.totalPnL)}`)
  lines.push(`Return %,${percent(s.totalReturnPercent)}`)

  return lines.join("\n")
}
