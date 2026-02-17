ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Hooks Barrel Export
// ----------------------------------------------------------
// PURPOSE
//   Single import surface for ALL client hooks
//
//   Prevents:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ long deep imports like ../../../hooks/xxx
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ messy structure
//
//   Instead use:
//
//     import {
//       useDashboardSnapshot,
//       useDashboardAlerts,
//       useDashboardTrend,
//     } from "@/lib/hooks"
//
//   RULE:
//     Every hooks folder must expose index.ts
//
// ==========================================================


// ==========================================================
// DASHBOARD HOOKS
// ==========================================================

export * from "./useDashboardSnapshot"
export * from "./useDashboardAlerts"
export * from "./useDashboardTrend"
export * from "./useDashboardCategories"
export * from "./useDashboardNetworth"
export * from "./useDashboardBurnRate"
export * from "./useDashboardSavingsRate"
export * from "./useDashboardContext"


// ==========================================================
// AI HOOKS
// ==========================================================

export * from "./useAIReady"
export * from "./useAIHotkeys"
export * from "./useAIAssistant"
export * from "./useAIShortcuts"
export * from "./useAIUsage"
export * from "./useAutoAIContext"
export * from "./usePageAIContext"
