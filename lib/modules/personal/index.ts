ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Personal Module Barrel Exports
// ==========================================================

// ----------------------------------------------------------
// Core planners
// ----------------------------------------------------------

export * from "./taxCalculator"
export * from "./taxAdvisor"

export * from "./firePlanner"
export * from "./retirementPlanner"

export * from "./investmentSimulator"


// ----------------------------------------------------------
// Advisors
// ----------------------------------------------------------

export * from "./cashflowAdvisor"
export * from "./savingsAdvisor"
export * from "./budgetAdvisor"
export * from "./expenseAnalyzer"
export * from "./categorySpendingAdvisor"
export * from "./subscriptionAdvisor"

export * from "./portfolioAdvisor"
export * from "./loanAdvisor"

export * from "./goalAdvisor"
export * from "./documentAdvisor" // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ profileAdvisor removed


// ----------------------------------------------------------
// Intelligence / Signals
// ----------------------------------------------------------

export * from "./insightBuilder"
export * from "./alertEngine"

export * from "./aiContextBuilder"
export * from "./aiPromptFormatter"


// ----------------------------------------------------------
// Aggregation / Reporting
// ----------------------------------------------------------

export * from "./metricsAggregator"
export * from "./reportBuilder"
export * from "./monthlySummaryBuilder"

export * from "./financialScore"
export * from "./financialHealthEngine"


// ----------------------------------------------------------
// Dashboard / AI Context (NEW SAFE ADD)
// ----------------------------------------------------------

export * from "./dashboardContextBuilder"

// ==========================================================
// ==========================================================
// BACKWARD COMPATIBILITY EXPORTS (Named ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â NOT default)
// ==========================================================

export { analyzeCashflow } from "./cashflowAdvisor"
export { analyzeGoals } from "./goalAdvisor"
export { buildFinancialHealthSnapshot as analyzeProfile } from "./financialHealthEngine"
export { analyzeNetworth } from "./networthAdvisor"
export { analyzePortfolio } from "./portfolioAdvisor"
export { aggregateMetrics } from "./metricsAggregator"
