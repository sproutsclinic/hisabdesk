ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Dashboard Module Barrel Export
// ----------------------------------------------------------
// PURPOSE
//   Single clean import point for ALL dashboard widgets
//
//   Prevents:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ long relative imports
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ messy ../../../ paths
//
//   Instead use:
//
//     import {
//       AlertsCard,
//       TrendCard,
//       CategoriesCard,
//       NetWorthCard,
//       BurnRateCard,
//       SavingsRateCard,
//       AIInsightsCard,
//       DashboardGrid,
//     } from "@/app/(personal)/dashboard"
//
//   RULE:
//     Every module folder should expose index.ts
//
// ==========================================================

// ----------------------------------------------------------
// AI
// ----------------------------------------------------------

export { default as AIInsightsCard } from "./AIInsightsCard"

// ----------------------------------------------------------
// Rule-based intelligence
// ----------------------------------------------------------

export { default as AlertsCard } from "./AlertsCard"

// ----------------------------------------------------------
// Metrics
// ----------------------------------------------------------

export { default as NetWorthCard } from "./NetWorthCard"
export { default as BurnRateCard } from "./BurnRateCard"
export { default as SavingsRateCard } from "./SavingsRateCard"

// ----------------------------------------------------------
// Analytics
// ----------------------------------------------------------

export { default as TrendCard } from "./TrendCard"
export { default as CategoriesCard } from "./CategoriesCard"

// ----------------------------------------------------------
// Layout
// ----------------------------------------------------------

export { default as DashboardGrid } from "./DashboardGrid"
