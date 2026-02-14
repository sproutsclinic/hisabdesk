// ==========================================================
// HisabDesk — Hooks Barrel Export
// ----------------------------------------------------------
// PURPOSE
//   Single import surface for ALL client hooks
//
//   Prevents:
//     ❌ long deep imports like ../../../hooks/xxx
//     ❌ messy structure
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
