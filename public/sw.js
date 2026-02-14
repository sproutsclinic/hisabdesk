/* =========================================
   HisabDesk Service Worker (FINAL ENTERPRISE)
   Phase 15–D — Offline + Push + Sync

   Features:
   ✅ offline caching
   ✅ faster repeat visits
   ✅ installable PWA
   ✅ network-first strategy
   ✅ NEVER caches API/Supabase
   ✅ push notifications
   ✅ notification click routing
   ✅ background sync trigger
========================================= */

const CACHE_NAME = "hisabdesk-v4" // bump on deploy

/* ========================================================
   STATIC ASSETS
======================================================== */

const STATIC_ASSETS = [
  "/",
  "/login",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
]

/* ================= INSTALL ================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS)
    )
  )
  self.skipWaiting()
})

/* ================= ACTIVATE ================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )

  self.clients.claim()
})

/* ================= FETCH ================= */
/*
  Strategy:
  Pages → network first
  Static → cache fallback
  APIs → NEVER cache
*/

self.addEventListener("fetch", (event) => {
  const req = event.request

  if (req.method !== "GET") return

  const url = new URL(req.url)

  /* ❌ NEVER cache APIs or Supabase */
  if (
    url.pathname.startsWith("/api") ||
    url.hostname.includes("supabase") ||
    url.hostname.includes("storage")
  ) {
    return
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(req, copy))
        }
        return res
      })
      .catch(() => caches.match(req))
  )
})

/* ========================================================
   PUSH NOTIFICATIONS
======================================================== */

self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title,
      options
    )
  )
})

/* ========================================================
   NOTIFICATION CLICK → OPEN APP
======================================================== */

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const target = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((list) => {
      for (const client of list) {
        if (client.url === target && "focus" in client) {
          return client.focus()
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(target)
      }
    })
  )
})

/* ========================================================
   BACKGROUND SYNC (offline queue flush)
======================================================== */

self.addEventListener("sync", (event) => {
  if (event.tag === "hisabdesk-sync") {
    event.waitUntil(
      fetch("/api/sync-queue").catch(() => {})
    )
  }
})
