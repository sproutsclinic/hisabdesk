"use client"

/**
 * =========================================================
 * Offline Fetch Wrapper (AUTO Queue Engine)
 * HisabDesk – Phase D (Enterprise Offline Automation)
 * =========================================================
 *
 * PURPOSE
 * Make ANY API call automatically offline-safe.
 *
 * WITHOUT THIS
 *   ❌ manually call enqueueRequest()
 *   ❌ easy to forget
 *
 * WITH THIS
 *   ✓ just use offlineFetch()
 *   ✓ auto queue if offline
 *   ✓ auto retry
 *   ✓ zero extra code
 *
 * =========================================================
 *
 * BEFORE
 *
 * await fetch("/api/expense", {...})
 *
 * AFTER
 *
 * await offlineFetch("/api/expense", {...})
 *
 * That's it.
 *
 * =========================================================
 *
 * CONNECTS TO
 *   lib/pwa/offline-sync-queue.ts
 *
 * SAFE
 * - client only
 * - drop-in replacement
 * - no breaking changes
 * =========================================================
 */

import {
  enqueueRequest,
  processQueue,
} from "@/lib/pwa/offline-sync-queue"

/* =========================================================
   OPTIONS
========================================================= */

type OfflineOptions = RequestInit & {
  offline?: boolean // default true
}

/* =========================================================
   MAIN FETCH
========================================================= */

export async function offlineFetch(
  url: string,
  options: OfflineOptions = {}
): Promise<Response> {
  const allowOffline = options.offline !== false

  /* ------------------------------------------------------
     ONLINE → normal fetch
  ------------------------------------------------------ */

  if (navigator.onLine) {
    try {
      const res = await fetch(url, options)

      /* after success, flush pending queue */
      processQueue()

      return res
    } catch (err) {
      /* network fail → fallback to queue */
      if (allowOffline && shouldQueue(options)) {
        await enqueueRequest(url, options)

        return fakeSuccess()
      }

      throw err
    }
  }

  /* ------------------------------------------------------
     OFFLINE → queue
  ------------------------------------------------------ */

  if (allowOffline && shouldQueue(options)) {
    await enqueueRequest(url, options)

    return fakeSuccess()
  }

  throw new Error("Offline")
}

/* =========================================================
   HELPERS
========================================================= */

function shouldQueue(options: RequestInit) {
  const method = (options.method || "GET").toUpperCase()

  /* only queue write operations */
  return method !== "GET"
}

/* ---------------------------------------------------------
   Fake success response (UX friendly)
--------------------------------------------------------- */

function fakeSuccess() {
  return new Response(
    JSON.stringify({
      ok: true,
      queued: true,
    }),
    {
      status: 202,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

/* =========================================================
   GLOBAL PATCH (optional)
   Call once to auto-replace window.fetch
========================================================= */

export function enableOfflineFetchGlobal() {
  const original = window.fetch

  window.fetch = ((input: any, init?: any) =>
    offlineFetch(input, init)) as typeof fetch

  return () => {
    window.fetch = original
  }
}
