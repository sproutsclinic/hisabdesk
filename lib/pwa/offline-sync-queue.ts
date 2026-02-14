/**
 * =========================================================
 * Offline Sync Queue (PWA Background Sync Engine)
 * HisabDesk – Mobile/Offline Reliability Layer
 * =========================================================
 *
 * PURPOSE
 * Enables TRUE offline support:
 *
 *   ✓ add income offline
 *   ✓ add expense offline
 *   ✓ upload later
 *   ✓ auto sync when back online
 *
 * WHY IMPORTANT (Mobile Users)
 *   CA/Doctors/Field work often:
 *     ❌ poor internet
 *     ❌ metro travel
 *     ❌ hospital basements
 *
 * Without this → data loss
 * With this    → seamless UX
 *
 * =========================================================
 *
 * ARCHITECTURE
 *
 * UI → enqueue()
 *        ↓
 * IndexedDB queue
 *        ↓
 * backgroundSync()
 *        ↓
 * API replay
 *
 * =========================================================
 *
 * USAGE
 *
 * import { enqueueRequest } from "@/lib/pwa/offline-sync-queue"
 *
 * await enqueueRequest("/api/expense", {
 *   method: "POST",
 *   body: {...}
 * })
 *
 * =========================================================
 */

"use client"

/* =========================================================
   TYPES
========================================================= */

type QueueItem = {
  id: string
  url: string
  options: RequestInit
  createdAt: number
}

/* =========================================================
   STORAGE KEY
========================================================= */

const KEY = "hisabdesk-offline-queue"

/* =========================================================
   HELPERS
========================================================= */

function loadQueue(): QueueItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

function saveQueue(queue: QueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(queue))
}

/* =========================================================
   ENQUEUE
========================================================= */

export async function enqueueRequest(
  url: string,
  options: RequestInit
) {
  const queue = loadQueue()

  queue.push({
    id: crypto.randomUUID(),
    url,
    options,
    createdAt: Date.now(),
  })

  saveQueue(queue)

  /* attempt immediate sync */
  if (navigator.onLine) {
    processQueue()
  }
}

/* =========================================================
   PROCESS QUEUE
========================================================= */

export async function processQueue() {
  if (!navigator.onLine) return

  const queue = loadQueue()

  if (!queue.length) return

  const remaining: QueueItem[] = []

  for (const item of queue) {
    try {
      await fetch(item.url, item.options)
    } catch {
      /* still offline or failed → keep */
      remaining.push(item)
    }
  }

  saveQueue(remaining)
}

/* =========================================================
   AUTO SYNC WHEN ONLINE
========================================================= */

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    processQueue()
  })
}

/* =========================================================
   UTILITIES
========================================================= */

export function getQueueSize() {
  return loadQueue().length
}

export function clearQueue() {
  saveQueue([])
}
