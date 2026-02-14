// ==========================================================
// HisabDesk — AI Components Barrel Export
// ----------------------------------------------------------
// PURPOSE
//   Single clean import point for ALL AI UI components
//
//   Prevents:
//     ❌ deep messy paths like ../../components/ai/xxx
//     ❌ scattered imports
//
//   Instead use:
//
//     import { AIAssistantGlobal } from "@/components/ai"
//
//   Enterprise rule:
//     Every folder should expose an index.ts
//
// ==========================================================

// ----------------------------------------------------------
// Global mounts
// ----------------------------------------------------------

export { default as AIAssistantGlobal } from "./AIAssistantGlobal"
export { default as AIAssistantFAB } from "./AIAssistantFAB"
export { default as AIAssistantCommandPalette } from "./AIAssistantCommandPalette"

// ----------------------------------------------------------
// Panels / Drawers
// ----------------------------------------------------------

export { default as AIAssistantPanel } from "./AIAssistantPanel"
export { default as AIAssistantDrawer } from "./AIAssistantDrawer"

// ----------------------------------------------------------
// Inline helpers
// ----------------------------------------------------------

export { default as AIAssistantInline } from "./AIAssistantInline"
export { default as AIAssistantQuickActions } from "./AIAssistantQuickActions"
export { default as AIAssistantTips } from "./AIAssistantTips"
export { default as AIAssistantHistory } from "./AIAssistantHistory"

// ----------------------------------------------------------
// Dashboard specific AI (NEW SAFE ADD)
// ----------------------------------------------------------

export { default as DashboardAIInline } from "./DashboardAIInline"

// ----------------------------------------------------------
// Usage UI
// ----------------------------------------------------------

export { default as AIUsageBadge } from "./AIUsageBadge"
export { default as AIUsageCard } from "./AIUsageCard"
export { default as AIUsageChart } from "./AIUsageChart"
export { default as AIUsageSection } from "./AIUsageSection"
export { default as AIAssistantStatusBar } from "./AIAssistantStatusBar"
