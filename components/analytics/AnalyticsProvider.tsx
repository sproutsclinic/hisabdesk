"use client"

import { useAutoPageTracking } from "@/lib/analytics/hooks"

/*
  PHASE 16 — Analytics Provider

  Mount once in AppShell or root layout.

  Enables:
  ✓ automatic page views
  ✓ centralized tracking
*/

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useAutoPageTracking()

  return <>{children}</>
}
