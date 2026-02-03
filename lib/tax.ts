// =============================
// HISABDESK TAX ENGINE (INDIA)
// =============================

export function calculateOldRegimeTax(income: number) {
  let tax = 0

  if (income <= 250000) return 0

  if (income > 250000)
    tax += Math.min(income - 250000, 250000) * 0.05

  if (income > 500000)
    tax += Math.min(income - 500000, 500000) * 0.2

  if (income > 1000000)
    tax += (income - 1000000) * 0.3

  return tax
}

export function calculateNewRegimeTax(income: number) {
  let tax = 0

  const slabs = [
    [300000, 0],
    [300000, 0.05],
    [300000, 0.1],
    [300000, 0.15],
    [300000, 0.2],
  ]

  let remaining = income

  for (const [limit, rate] of slabs) {
    if (remaining <= 0) break
    const taxable = Math.min(remaining, limit)
    tax += taxable * rate
    remaining -= taxable
  }

  if (remaining > 0) tax += remaining * 0.3

  return tax
}

// 44ADA for professionals (50% taxable)
export function calculate44ADA(income: number) {
  return income * 0.5
}
export function getBestTaxOption(oldTax: number, newTax: number, adaTax: number) {
  const min = Math.min(oldTax, newTax, adaTax)

  if (min === oldTax) return { label: "Old Regime", value: oldTax }
  if (min === newTax) return { label: "New Regime", value: newTax }
  return { label: "44ADA", value: adaTax }
}
