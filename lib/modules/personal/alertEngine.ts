ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Alert Engine (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Central rule engine to convert all advisor outputs ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ alerts
//
//   This is the FINAL LAYER before UI/AI
//   All modules feed signals here.
//   Produces clean, structured alerts.
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - dashboard alerts panel
//   - notifications
//   - AI context builder
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export type AlertLevel = "info" | "warning" | "critical"

export interface Alert {
  id: string
  level: AlertLevel
  title: string
  value?: number | string
}

export interface AlertSignals {
  savingsRate?: number
  burnRisk?: "low" | "medium" | "high"
  runwayMonths?: number

  overspendCount?: number
  goalBehindCount?: number

  taxSavingsPossible?: number
  loanInterestSaved?: number

  networthTrend?: "up" | "down" | "flat"
}

// ==========================================================
// HELPERS
// ==========================================================

function makeAlert(
  id: string,
  level: AlertLevel,
  title: string,
  value?: number | string
): Alert {
  return { id, level, title, value }
}

// ==========================================================
// CORE ENGINE
// ==========================================================

export function buildAlerts(signals: AlertSignals): Alert[] {
  const alerts: Alert[] = []

  // --------------------------------------------------------
  // Savings
  // --------------------------------------------------------

  if (signals.savingsRate !== undefined) {
    if (signals.savingsRate < 5) {
      alerts.push(
        makeAlert(
          "low_savings",
          "critical",
          "Savings rate too low",
          `${signals.savingsRate}%`
        )
      )
    } else if (signals.savingsRate < 15) {
      alerts.push(
        makeAlert(
          "weak_savings",
          "warning",
          "Increase monthly savings",
          `${signals.savingsRate}%`
        )
      )
    }
  }

  // --------------------------------------------------------
  // Burn risk
  // --------------------------------------------------------

  if (signals.burnRisk === "high") {
    alerts.push(
      makeAlert(
        "burn_high",
        "critical",
        "Spending too high vs income"
      )
    )
  } else if (signals.burnRisk === "medium") {
    alerts.push(
      makeAlert(
        "burn_medium",
        "warning",
        "Monitor monthly expenses"
      )
    )
  }

  // --------------------------------------------------------
  // Runway
  // --------------------------------------------------------

  if (signals.runwayMonths !== undefined) {
    if (signals.runwayMonths < 2) {
      alerts.push(
        makeAlert(
          "runway_low",
          "critical",
          "Emergency fund very low",
          `${signals.runwayMonths} months`
        )
      )
    }
  }

  // --------------------------------------------------------
  // Overspending
  // --------------------------------------------------------

  if ((signals.overspendCount || 0) > 0) {
    alerts.push(
      makeAlert(
        "overspend",
        "warning",
        "Categories overspent",
        signals.overspendCount
      )
    )
  }

  // --------------------------------------------------------
  // Goals behind
  // --------------------------------------------------------

  if ((signals.goalBehindCount || 0) > 0) {
    alerts.push(
      makeAlert(
        "goal_delay",
        "warning",
        "Goals behind schedule",
        signals.goalBehindCount
      )
    )
  }

  // --------------------------------------------------------
  // Tax saving opportunity
  // --------------------------------------------------------

  if ((signals.taxSavingsPossible || 0) > 0) {
    alerts.push(
      makeAlert(
        "tax_savings",
        "info",
        "Tax saving available",
        `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${signals.taxSavingsPossible}`
      )
    )
  }

  // --------------------------------------------------------
  // Loan savings
  // --------------------------------------------------------

  if ((signals.loanInterestSaved || 0) > 0) {
    alerts.push(
      makeAlert(
        "loan_savings",
        "info",
        "Loan prepayment can save interest",
        `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${signals.loanInterestSaved}`
      )
    )
  }

  // --------------------------------------------------------
  // Net worth trend
  // --------------------------------------------------------

  if (signals.networthTrend === "down") {
    alerts.push(
      makeAlert(
        "networth_drop",
        "warning",
        "Net worth declining"
      )
    )
  }

  return alerts
}
