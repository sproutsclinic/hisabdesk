"use client"

/*
  PHASE 16 — Simple React Hooks for Analytics

  Usage anywhere in UI:

  const { trackClick, trackPage } = useAnalytics()

  trackClick("upgrade_clicked")
  trackPage("dashboard_opened")
*/

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "./client"

export function useAnalytics() {
  function trackClick(event: string, props?: Record<string, any>) {
    track(event, props)
  }

  function trackPage(event: string, props?: Record<string, any>) {
    track(event, props)
  }

  return {
    trackClick,
    trackPage,
  }
}

/*
  Auto page view tracker
  Just mount once in AppShell or layout
*/

export function useAutoPageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    track("page_view", { path: pathname })
  }, [pathname])
}
