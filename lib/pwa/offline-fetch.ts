ï»¿"use client"

/**
 * =========================================================
 * Offline Fetch Wrapper (AUTO Queue Engine)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Phase D (Enterprise Offline Automation)
 * =========================================================
 *
 * PURPOSE
 * Make ANY API call automatically offline-safe.
 *
 * WITHOUT THIS
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ manually call enqueueRequest()
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ easy to forget
 *
 * WITH THIS
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ just use offlineFetch()
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ auto queue if offline
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ auto retry
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ zero extra code
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
     ONLINE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ normal fetch
  ------------------------------------------------------ */

  if (navigator.onLine) {
    try {
      const res = await fetch(url, options)

      /* after success, flush pending queue */
      processQueue()

      return res
    } catch (err) {
      /* network fail ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ fallback to queue */
      if (allowOffline && shouldQueue(options)) {
        await enqueueRequest(url, options)

        return fakeSuccess()
      }

      throw err
    }
  }

  /* ------------------------------------------------------
     OFFLINE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ queue
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
