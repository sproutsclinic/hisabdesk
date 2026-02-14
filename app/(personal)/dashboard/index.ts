// ==========================================================
// HisabDesk — Dashboard Module Barrel Export
// ----------------------------------------------------------
// PURPOSE
//   Single clean import point for ALL dashboard widgets
//
//   Prevents:
//     ❌ long relative imports
//     ❌ messy ../../../ paths
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
