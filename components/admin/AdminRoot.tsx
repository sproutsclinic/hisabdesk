"use client"

import AdminGuard from "./AdminGuards"

/*
  PHASE 17 — Admin Root Wrapper

  Use this to wrap any admin page:

  <AdminRoot>
    <AdminAnalyticsRoot />
  </AdminRoot>

  Provides:
  ✓ client admin protection
*/

export default function AdminRoot({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
