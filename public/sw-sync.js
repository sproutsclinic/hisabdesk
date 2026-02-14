/**
 * =========================================================
 * Service Worker – Background Sync + Push Handler
 * HisabDesk – Phase D (Mobile PWA Core)
 * =========================================================
 *
 * PURPOSE
 * Handles:
 *   ✓ background sync (offline queue flush)
 *   ✓ push notifications
 *   ✓ notification click routing
 *
 * IMPORTANT
 * This file complements:
 *   lib/pwa/offline-sync-queue.ts
 *   lib/pwa/background-sync.ts
 *   lib/pwa/push-notifications.ts
 *
 * HOW TO USE
 * 1) Place in /public
 * 2) Register in existing service worker OR:
 *      navigator.serviceWorker.register("/sw-sync.js")
 *
 * SAFE
 * - standalone
 * - does NOT modify existing service worker
 *
 * =========================================================
 */

/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", () => {
  self.skipWaiting()
})

/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

/* =========================================================
   BACKGROUND SYNC
========================================================= */

self.addEventListener("sync", (event) => {
  if (event.tag === "hisabdesk-sync") {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
  })

  for (const client of clients) {
    client.postMessage({
      type: "FLUSH_OFFLINE_QUEUE",
    })
  }
}

/* =========================================================
   PUSH RECEIVED
========================================================= */

self.addEventListener("push", (event) => {
  if (!event.data) return

  let payload = {}

  try {
    payload = event.data.json()
  } catch {
    payload = { title: "HisabDesk", body: event.data.text() }
  }

  const title = payload.title || "HisabDesk"
  const options = {
    body: payload.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: {
      url: payload.url || "/dashboard",
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

/* =========================================================
   NOTIFICATION CLICK
========================================================= */

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(targetUrl)) {
          return client.focus()
        }
      }
      return self.clients.openWindow(targetUrl)
    })
  )
})

/* =========================================================
   MESSAGE LISTENER (manual trigger)
========================================================= */

self.addEventListener("message", (event) => {
  if (event.data?.type === "FORCE_SYNC") {
    handleBackgroundSync()
  }
})
