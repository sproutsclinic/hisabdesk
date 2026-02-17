ï»¿"use client"

/**
 * =========================================================
 * Usage Dashboard (Complete Billing Overview Panel)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing Control Center
 * =========================================================
 *
 * PURPOSE
 * One unified billing section combining:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Billing summary (plan + renewal)
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Usage meters
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Pricing table
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Upgrade nudges
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
