/**
 * =========================================================
 * Push Notifications Engine (PWA)
 * HisabDesk – Phase D (Mobile)
 * =========================================================
 *
 * PURPOSE
 * Send real-time notifications:
 *
 *   ✓ tax reminders
 *   ✓ GST filing alerts
 *   ✓ subscription expiry
 *   ✓ payment success
 *   ✓ referral rewards
 *   ✓ admin broadcasts
 *
 * WORKS WITH
 *   ✓ Service Worker
 *   ✓ Web Push API
 *   ✓ Supabase backend storage
 *
 * FEATURES
 *   ✓ permission handling
 *   ✓ subscribe/unsubscribe
 *   ✓ save subscription to DB
 *   ✓ send test notifications
 *
 * SAFE
 * - client only
 * - no existing files modified
 *
 * REQUIRED TABLE (Supabase SQL)
 *
 * create table push_subscriptions (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid,
 *   subscription jsonb,
 *   created_at timestamp default now()
 * );
 *
 * =========================================================
 */

"use client"

/* =========================================================
   TYPES
========================================================= */

export type PushPayload = {
  title: string
  body: string
  url?: string
}

/* =========================================================
   PERMISSION
========================================================= */

export async function requestPushPermission() {
  if (!("Notification" in window)) return false

  const result = await Notification.requestPermission()
  return result === "granted"
}

/* =========================================================
   REGISTER SERVICE WORKER
========================================================= */

async function getSWRegistration() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker not supported")
  }

  return navigator.serviceWorker.ready
}

/* =========================================================
   SUBSCRIBE
========================================================= */

export async function subscribePush(
  supabase: any,
  userId: string,
  publicVapidKey: string
) {
  const allowed = await requestPushPermission()
  if (!allowed) return

  const registration = await getSWRegistration()

  const subscription =
    await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        publicVapidKey
      ),
    })

  /* save to supabase */
  await supabase.from("push_subscriptions").insert({
    user_id: userId,
    subscription,
  })

  return subscription
}

/* =========================================================
   UNSUBSCRIBE
========================================================= */

export async function unsubscribePush(
  supabase: any,
  userId: string
) {
  const registration = await getSWRegistration()
  const sub = await registration.pushManager.getSubscription()

  if (sub) await sub.unsubscribe()

  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
}

/* =========================================================
   LOCAL TEST NOTIFICATION (debug)
========================================================= */

export async function showLocalNotification(
  payload: PushPayload
) {
  const registration = await getSWRegistration()

  await registration.showNotification(payload.title, {
    body: payload.body,
    icon: "/icons/icon-192.png",
    data: { url: payload.url || "/" },
  })
}

/* =========================================================
   HELPERS
========================================================= */

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  )
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const raw = window.atob(base64)
  const output = new Uint8Array(raw.length)

  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i)
  }

  return output
}
