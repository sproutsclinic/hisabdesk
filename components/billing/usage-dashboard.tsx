"use client"

/**
 * =========================================================
 * Usage Dashboard (Complete Billing Overview Panel)
 * HisabDesk – Billing Control Center
 * =========================================================
 *
 * PURPOSE
 * One unified billing section combining:
 *
 *   ✓ Billing summary (plan + renewal)
 *   ✓ Usage meters
 *   ✓ Pricing table
 *   ✓ Upgrade nudges
 *
 * This becomes the main reusable billing block.
 *
 * =========================================================
 *
 * USAGE
 *
 * On /billing page:
 *
 * <UsageDashboard orgId={orgId} />
 *
 * =========================================================
 */

import BillingSummaryCard from "@/components/billing/billing-summary-card"
import PlanUsageMeter from "@/components/billing/plan-usage-meter"
import UpgradeBanner from "@/components/billing/upgrade-banner"
import PricingTable from "@/components/billing/pricing-table"

/* =========================================================
   COMPONENT
========================================================= */

export default function UsageDashboard({
  orgId,
}: {
  orgId: string
}) {
  return (
    <div className="space-y-8">
      {/* banner */}
      <UpgradeBanner />

      {/* summary */}
      <BillingSummaryCard />

      {/* usage */}
      <PlanUsageMeter orgId={orgId} />

      {/* pricing */}
      <PricingTable />
    </div>
  )
}
