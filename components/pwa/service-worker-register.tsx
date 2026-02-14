"use client"

/**
 * =========================================================
 * Service Worker Register (Auto PWA Bootstrap)
 * HisabDesk – Phase D (Mobile Core)
 * =========================================================
 *
 * PURPOSE
 * Automatically registers:
 *   ✓ existing service worker (offline caching)
 *   ✓ background sync worker (sw-sync.js)
 *
 * WHY
 * Without registration:
 *   ❌ offline queue won't flush
 *   ❌ push won't work
 *   ❌ background sync won't run
 *
 * ADD ONCE (IMPORTANT)
 * In app/layout.tsx (root layout):
 *
 *   import ServiceWorkerRegister from "@/components/pwa/service-worker-register"
 *   <ServiceWorkerRegister />
 *
 * SAFE
 * - client only
 * - no existing file changes
 * - silent registration
 *
 * =========================================================
 */

import { useEffect } from "react"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    async function register() {
      try {
        /* =========================================
           1️⃣ Main SW (if you already have one)
        ========================================= */

        try {
          await navigator.serviceWorker.register("/sw.js")
        } catch {
          /* ignore if not present */
        }

        /* =========================================
           2️⃣ Background Sync + Push Worker
        ========================================= */

        await navigator.serviceWorker.register("/sw-sync.js", {
          scope: "/",
        })
      } catch (err) {
        console.error("SW registration failed:", err)
      }
    }

    register()
  }, [])

  return null
}
