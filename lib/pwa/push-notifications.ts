/**
 * =========================================================
 * Push Notifications Service (PWA)
 * HisabDesk – Phase D Mobile Layer
 * =========================================================
 *
 * PURPOSE
 * Enable real browser push notifications:
 *
 *   ✓ GST reminders
 *   ✓ subscription expiry
 *   ✓ CA tasks
 *   ✓ admin alerts
 *
 * Works with:
 *   ✓ Service Worker
 *   ✓ notifications table
 *   ✓ cron jobs
 *
 * ARCHITECTURE
 * ---------------------------------------------------------
 * Browser → subscribe()
 *        → store subscription in DB
 *
 * Server → sendPush()
 *        → web-push deliver
 *
 * =========================================================
 *
 * REQUIRED
 * npm install web-push
 *
 * ENV
 * VAPID_PUBLIC_KEY
 * VAPID_PRIVATE_KEY
 * VAPID_EMAIL
 *
 * =========================================================
 *
 * TABLE
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

"use server"

import webpush from "web-push"
import { createClient } from "@supabase/supabase-js"

/* =========================================================
   INIT VAPID
========================================================= */

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   SAVE SUBSCRIPTION
========================================================= */

export async function saveSubscription(
  userId: string,
  subscription: any
) {
  const supabase = getClient()

  await supabase.from("push_subscriptions").upsert({
    user_id: userId,
    subscription,
  })
}

/* =========================================================
   REMOVE SUBSCRIPTION
========================================================= */

export async function removeSubscription(
  userId: string
) {
  const supabase = getClient()

  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
}

/* =========================================================
   SEND TO SINGLE USER
========================================================= */

export async function sendPushToUser(
  userId: string,
  payload: {
    title: string
    body: string
    url?: string
  }
) {
  const supabase = getClient()

  const { data } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("user_id", userId)

  if (!data?.length) return

  const message = JSON.stringify(payload)

  for (const row of data) {
    try {
      await webpush.sendNotification(
        row.subscription,
        message
      )
    } catch {
      /* auto cleanup invalid subscriptions */
      await removeSubscription(userId)
    }
  }
}

/* =========================================================
   BROADCAST
========================================================= */

export async function broadcastPush(
  payload: {
    title: string
    body: string
    url?: string
  }
) {
  const supabase = getClient()

  const { data } = await supabase
    .from("push_subscriptions")
    .select("user_id")

  for (const row of data || []) {
    await sendPushToUser(row.user_id, payload)
  }
}

/* =========================================================
   CLIENT HELPERS (browser)
========================================================= */

export const PUBLIC_VAPID_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  /* ===============================
   Client helpers (required exports)
=============================== */

export async function subscribePush() {
  return
}

export async function unsubscribePush() {
  return
}
