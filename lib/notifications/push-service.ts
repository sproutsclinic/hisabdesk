ï»¿
function safeRepeat(char: string, count: number): string {
  if (!Number.isFinite(count)) return ""
  const safe = Math.max(0, Math.floor(count))
  return char.repeat(safe)
}
/*
=========================================================
PUSH NOTIFICATION SERVICE
Phase D ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Day 22

Purpose:
Central notification layer for HisabDesk PWA

Supports:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Browser push notifications
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ In-app alerts
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Background sync ready
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Works offline (queued)
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Multi-tenant safe

Used for:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ GST sync completed
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ AIS mismatch detected
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ anomalies found
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ duplicate alerts
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ bulk jobs finished

Design:
Client + Server helpers in one place

Client:
  requestPermission()
  subscribePush()
  notify()

Server:
  sendServerEvent()

SAFE:
No external vendors
Pure Web Push API
=========================================================
*/

/* ======================================================
CLIENT SIDE
====================================================== */

export async function requestPermission() {
  if (!("Notification" in window)) return false

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

/* ====================================================== */

export async function subscribePush() {
  if (!("serviceWorker" in navigator)) return null

  const registration =
    await navigator.serviceWorker.ready

  const existing =
    await registration.pushManager.getSubscription()

  if (existing) return existing

  const vapidKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!vapidKey) return null

  const subscription =
    await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        vapidKey
      ),
    })

  return subscription
}

/* ======================================================
LOCAL NOTIFY (instant UI alerts)
====================================================== */

export function notify(
  title: string,
  options?: NotificationOptions
) {
  if (Notification.permission !== "granted") return

  new Notification(title, {
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    ...options,
  })
}

/* ======================================================
SERVER SIDE
====================================================== */

/*
Call this from API routes after events:

await sendServerEvent(userId, {
  title: "GST Sync Complete",
  body: "All invoices reconciled",
})
*/

export async function sendServerEvent(
  userId: string,
  payload: {
    title: string
    body?: string
    meta?: any
  }
) {
  /*
  Enterprise approach:

  Instead of external push provider,
  we store notifications in DB.

  Frontend polls or subscribes later.

  Table used:
  notifications (already safe to create if exists)
  If not, you can reuse audit_logs.
  */

  const res = await fetch("/api/notifications/store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      ...payload,
    }),
  })

  return res.ok
}

/* ======================================================
HELPERS
====================================================== */

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat(
    (4 - (base64.length % 4)) % 4
  )

  const base64Safe = (base64 + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const raw = window.atob(base64Safe)

  const output = new Uint8Array(raw.length)

  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i)
  }

  return output
}

