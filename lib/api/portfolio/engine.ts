/* =========================================================
   HisabDesk — Portfolio Engine (PURE)
   ---------------------------------------------------------
   BUSINESS / COMPUTATION LAYER ONLY

   PURPOSE
   - All portfolio math lives here
   - Deterministic
   - Testable
   - Reusable by:
       ✓ service
       ✓ API routes
       ✓ AI context
       ✓ reports

   RULES
   ✅ pure functions only
   ✅ no DB
   ✅ no fetch
   ✅ no OpenAI
   ✅ no side effects

   ARCHITECTURE
     route → service → engine (THIS FILE)

   ========================================================= */

import type {
  AssetRow,
  PortfolioAssetComputed,
  PortfolioSummary,
  PortfolioOverview,
} from "./types"

/* =========================================================
   HELPERS
   ========================================================= */

function clamp(n: number): number {
  return Math.max(0, Number(n || 0))
}

function round(n: number): number {
  return Number(n.toFixed(2))
}

/* =========================================================
   PER ASSET COMPUTATION
   ========================================================= */

export function computeAsset(
  asset: AssetRow,
  portfolioTotalCurrent: number,
): PortfolioAssetComputed {
  const quantity = clamp(asset.quantity)
  const buyPrice = clamp(asset.buy_price)
  const currentPrice = clamp(asset.current_price)

  const investedValue = quantity * buyPrice
  const currentValue = quantity * currentPrice

  const profitLoss = currentValue - investedValue

  const returnPercent =
    investedValue > 0 ? (profitLoss / investedValue) * 100 : 0

  const allocationPercent =
    portfolioTotalCurrent > 0
      ? (currentValue / portfolioTotalCurrent) * 100
      : 0

  return {
    ...asset,

    investedValue: round(investedValue),
    currentValue: round(currentValue),
    profitLoss: round(profitLoss),
    returnPercent: round(returnPercent),
    allocationPercent: round(allocationPercent),
  }
}

/* =========================================================
   SUMMARY
   ========================================================= */

export function computeSummary(
  assets: PortfolioAssetComputed[],
): PortfolioSummary {
  const totalInvested = assets.reduce(
    (a, b) => a + b.investedValue,
    0,
  )

  const totalCurrent = assets.reduce(
    (a, b) => a + b.currentValue,
    0,
  )

  const totalPnL = totalCurrent - totalInvested

  const totalReturnPercent =
    totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  return {
    totalInvested: round(totalInvested),
    totalCurrent: round(totalCurrent),
    totalPnL: round(totalPnL),
    totalReturnPercent: round(totalReturnPercent),
  }
}

/* =========================================================
   FULL OVERVIEW
   ========================================================= */

export function computePortfolioOverview(
  rows: AssetRow[],
): PortfolioOverview {
  /* First pass: compute total current for allocation calc */
  const totalCurrent = rows.reduce(
    (sum, a) => sum + clamp(a.quantity) * clamp(a.current_price),
    0,
  )

  const assetsComputed = rows.map((a) =>
    computeAsset(a, totalCurrent),
  )

  const summary = computeSummary(assetsComputed)

  return {
    assets: assetsComputed,
    summary,
  }
}
