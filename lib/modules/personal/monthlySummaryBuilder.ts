ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Monthly Summary Builder (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Produce ONE compact monthly financial snapshot
//
//   This is the:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Dashboard header summary
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Insights base
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ AI prompt input (token-efficient)
//
//   Think:
//     "This month in numbers"
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface MonthlySummaryInput {
  income: number
  expense: number

  lastMonthIncome?: number
  lastMonthExpense?: number

  networth?: number
  lastMonthNetworth?: number

  alerts?: number
}

export interface MonthlySummary {
  savings: number
  savingsRate: number

  incomeChange: number
  expenseChange: number
  networthChange: number

  cashflow: "positive" | "neutral" | "negative"

  alertCount: number
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Math.round(n)
}

function percent(a: number, b: number) {
  if (b === 0) return 0
  return (a / b) * 100
}

function diff(current?: number, last?: number) {
  if (current === undefined || last === undefined) return 0
  return current - last
}

// ==========================================================
// CORE BUILDER
// ==========================================================

export function buildMonthlySummary(
  input: MonthlySummaryInput
): MonthlySummary {
  const savings = input.income - input.expense

  const savingsRate = percent(savings, input.income)

  const incomeChange = diff(input.income, input.lastMonthIncome)
  const expenseChange = diff(
    input.expense,
    input.lastMonthExpense
  )

  const networthChange = diff(
    input.networth,
    input.lastMonthNetworth
  )

  let cashflow: MonthlySummary["cashflow"] = "neutral"

  if (savings > 0) cashflow = "positive"
  if (savings < 0) cashflow = "negative"

  return {
    savings: round(savings),
    savingsRate: round(savingsRate),

    incomeChange: round(incomeChange),
    expenseChange: round(expenseChange),
    networthChange: round(networthChange),

    cashflow,

    alertCount: input.alerts ?? 0,
  }
}
