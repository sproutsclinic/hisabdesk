/**
 * =========================================================
 * Background Sync Engine (PWA Advanced)
 * HisabDesk – Phase D (Mobile)
 * =========================================================
 *
 * PURPOSE
 * True offline reliability using Background Sync API
 *
 * Even if:
 *   ✓ app closed
 *   ✓ tab closed
 *   ✓ internet lost
 *
 * Browser will automatically sync later.
 *
 * Works with:
 *   ✓ Service Worker
 *   ✓ offline-sync-queue.ts
 *
 * FLOW
 * queueAction()
 *   → registerBackgroundSync()
 *      → browser wakes SW when online
 *         → flushQueue()
 *
 * SAFE
 * - client only
 * - no existing file changes
 *
 * USAGE
 *
 * import { registerBackgroundSync } from "@/lib/pwa/background-sync"
 *
 * await registerBackgroundSync()
 *
 * =========================================================
 */

"use client"

/* =========================================================
   REGISTER SYNC
========================================================= */

export async function registerBackgroundSync(
  tag = "hisabdesk-sync"
) {
  if (
    !("serviceWorker" in navigator) ||
    !("SyncManager" in window)
  ) {
    return false
  }

  const registration = await navigator.serviceWorker.ready

  try {
    await (registration as any).sync.register(tag)
    return true
  } catch {
    return false
  }
}

/* =========================================================
   AUTO REGISTER AFTER OFFLINE ACTION
========================================================= */

export async function triggerSyncIfOffline() {
  if (!navigator.onLine) {
    await registerBackgroundSync()
  }
}

/* =========================================================
   SERVICE WORKER MESSAGE HELPER
========================================================= */

export function notifyServiceWorker(data: any) {
  if (!navigator.serviceWorker?.controller) return

  navigator.serviceWorker.controller.postMessage(data)
}

/* =========================================================
   OPTIONAL: AUTO MODE
========================================================= */

export function enableBackgroundSync() {
  window.addEventListener("offline", () => {
    registerBackgroundSync()
  })
}
