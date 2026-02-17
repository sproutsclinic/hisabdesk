ï»¿export interface WealthInput {
  currentSavings: number
  monthlyInvestment: number
  expectedReturnPct: number
  years: number
}

export interface WealthProjectionPoint {
  year: number
  value: number
}

export interface WealthProjectionResult {
  finalValue: number
  timeline: WealthProjectionPoint[]
}

export interface RetirementResult {
  inflationAdjustedAnnualExpense: number
  requiredCorpus: number
}
