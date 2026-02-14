"use client"

import AdminAnalyticsCharts from "./AdminAnalyticsCharts"
import AdminFunnelChart from "./AdminFunnelChart"
import AdminConversionCard from "./AdminConversionCard"

/*
  PHASE 16 — Analytics Root (Admin)

  Plug into /admin dashboard:

  <AdminAnalyticsRoot />

  Includes:
  ✓ Event activity bars
  ✓ Funnel chart
  ✓ Conversion stats
*/

export default function AdminAnalyticsRoot() {
  return (
    <div className="grid gap-6">
      <AdminConversionCard />

      <div className="grid md:grid-cols-2 gap-6">
        <AdminAnalyticsCharts />
        <AdminFunnelChart />
      </div>
    </div>
  )
}
