ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Portfolio Engine (PURE)
   ---------------------------------------------------------
   BUSINESS / COMPUTATION LAYER ONLY

   Deterministic financial math (ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ safe)
   No floating point drift.
   Strict-mode hardened.

   route ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ engine (THIS FILE)
   ========================================================= */

import type {
  AssetRow,
  PortfolioAssetComputed,
  PortfolioSummary,
  PortfolioOverview,
} from "./types"

/* =========================================================
   PRECISION MODEL
   ---------------------------------------------------------
   All math done in paise (ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ * 100) to avoid FP drift.
   ========================================================= */

const SCALE = 100

function toPaise(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0
  if (value <= 0) return 0
  return Math.round(value * SCALE)
}

function fromPaise(value: number): number {
  return Number((value / SCALE).toFixed(2))
}

function safeDivide(a: number, b: number): number {
  if (b === 0) return 0
  return a / b
}

/* =========================================================
   PER ASSET COMPUTATION
   ========================================================= */

export function computeAsset(
  asset: AssetRow,
  portfolioTotalCurrentPaise: number,
): PortfolioAssetComputed {
  const quantity = toPaise(asset.quantity)
  const buyPrice = toPaise(asset.buy_price)
  const currentPrice = toPaise(asset.current_price)

  // qty already scaled ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ remove one SCALE during multiply
  const investedPaise = Math.round((quantity * buyPrice) / SCALE)
  const currentPaise = Math.round((quantity * currentPrice) / SCALE)

  const pnlPaise = currentPaise - investedPaise

  const returnPercent =
    safeDivide(pnlPaise, investedPaise) * 100

  const allocationPercent =
    safeDivide(currentPaise, portfolioTotalCurrentPaise) * 100

  return {
    ...asset,

    investedValue: fromPaise(investedPaise),
    currentValue: fromPaise(currentPaise),
    profitLoss: fromPaise(pnlPaise),

    returnPercent: Number(returnPercent.toFixed(2)),
    allocationPercent: Number(allocationPercent.toFixed(2)),
  }
}

/* =========================================================
   SUMMARY
   ========================================================= */

export function computeSummary(
  assets: PortfolioAssetComputed[],
): PortfolioSummary {
  let investedTotalPaise = 0
  let currentTotalPaise = 0

  for (const a of assets) {
    investedTotalPaise += toPaise(a.investedValue)
    currentTotalPaise += toPaise(a.currentValue)
  }

  const pnlPaise = currentTotalPaise - investedTotalPaise

  const totalReturnPercent =
    safeDivide(pnlPaise, investedTotalPaise) * 100

  return {
    totalInvested: fromPaise(investedTotalPaise),
    totalCurrent: fromPaise(currentTotalPaise),
    totalPnL: fromPaise(pnlPaise),
    totalReturnPercent: Number(totalReturnPercent.toFixed(2)),
  }
}

/* =========================================================
   FULL OVERVIEW
   ========================================================= */

export function computePortfolioOverview(
  rows: AssetRow[],
): PortfolioOverview {
  /* FIRST PASS ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â deterministic total current */
  let totalCurrentPaise = 0

  for (const r of rows) {
    const qty = toPaise(r.quantity)
    const price = toPaise(r.current_price)
    totalCurrentPaise += Math.round((qty * price) / SCALE)
  }

  const assetsComputed = rows.map((r) =>
    computeAsset(r, totalCurrentPaise),
  )

  const summary = computeSummary(assetsComputed)

  return {
    assets: assetsComputed,
    summary,
  }
}
