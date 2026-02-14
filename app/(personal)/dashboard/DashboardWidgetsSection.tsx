"use client"

// ==========================================================
// HisabDesk — Dashboard Widgets Section
// ----------------------------------------------------------
// PURPOSE
//   Unified container for ALL non-AI dashboard metrics
//
//   Separates:
//     Metrics Widgets  → this file
//     AI Section       → DashboardAISection
//
//   Why:
//     ✓ keeps page.tsx extremely clean
//     ✓ scalable (plug new cards easily)
//     ✓ avoids layout duplication
//     ✓ enterprise separation of concerns
//
//   Contains:
//     ✓ NetWorthCard
//     ✓ SavingsRateCard
//     ✓ BurnRateCard
//     ✓ TrendCard
//     ✓ CategoriesCard
//
//   Usage:
//
//     <DashboardWidgetsSection />
//
// ==========================================================

import DashboardGrid from "./DashboardGrid"

import NetWorthCard from "./NetWorthCard"
import SavingsRateCard from "./SavingsRateCard"
import BurnRateCard from "./BurnRateCard"
import TrendCard from "./TrendCard"
import CategoriesCard from "./CategoriesCard"

// ==========================================================
// COMPONENT
// ==========================================================

export default function DashboardWidgetsSection() {
  return (
    <DashboardGrid>

      {/* Core Wealth */}
      <NetWorthCard />

      {/* Savings Performance */}
      <SavingsRateCard />

      {/* Burn Health */}
      <BurnRateCard />

      {/* Monthly Cashflow */}
      <TrendCard />

      {/* Spending Breakdown */}
      <CategoriesCard />

    </DashboardGrid>
  )
}
