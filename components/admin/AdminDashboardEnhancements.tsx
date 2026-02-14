"use client"

import EnterpriseStatusCard from "@/components/enterprise/EnterpriseStatusCard"
import EnterpriseReadyBadge from "@/components/enterprise/EnterpriseReadyBadge"

/*
  PHASE 18 — Admin Dashboard Enhancements

  Optional plug-in block for /admin dashboard

  Shows:
  ✓ Enterprise ready badge
  ✓ System health card

  Usage:
  <AdminDashboardEnhancements />
*/

export default function AdminDashboardEnhancements() {
  return (
    <div className="space-y-4">
      <EnterpriseReadyBadge />
      <EnterpriseStatusCard />
    </div>
  )
}
