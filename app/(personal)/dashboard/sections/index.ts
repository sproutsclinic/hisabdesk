// ==========================================================
// HisabDesk — Dashboard Sections Barrel Export
// ----------------------------------------------------------
// PURPOSE
//   Clean import surface for high-level dashboard sections
//
//   Sections = composed blocks (not small cards)
//
//   Difference:
//     Cards    → small widgets (NetWorthCard etc.)
//     Sections → grouped layouts (AI + Widgets)
//
//   Prevents:
//     ❌ messy deep imports
//
//   Instead use:
//
//     import {
//       DashboardAISection,
//       DashboardWidgetsSection,
//     } from "@/app/(personal)/dashboard/sections"
//
//   RULE:
//     page.tsx should mostly import SECTIONS only
//     not individual cards
//
// ==========================================================


// ----------------------------------------------------------
// Sections
// ----------------------------------------------------------

export { default as DashboardAISection } from "../DashboardAISection"
export { default as DashboardWidgetsSection } from "../DashboardWidgetsSection"
