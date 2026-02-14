"use client"

/**
 * =========================================================
 * Request Batcher (API Call Coalescing Engine)
 * HisabDesk – Phase F (Scale & Cost Optimization)
 * =========================================================
 *
 * PURPOSE
 * Merge multiple rapid API calls into ONE request.
 *
 * WITHOUT BATCHING
 *   ❌ 50 quick edits → 50 API calls
 *   ❌ higher Supabase cost
 *   ❌ slower UI
 *
 * WITH BATCHING
 *   ✓ 50 edits → 1 API call
 *   ✓ faster
 *   ✓ cheaper
 *   ✓ scalable
 *
 * Similar to:
 *   Stripe dashboard
 *   Notion typing sync
 *   Google Docs batching
 *
 * =========================================================
 *
 * WHAT IT DOES
 *
 *   ✓ collects calls within window (e.g. 300ms)
 *   ✓ groups them
 *   ✓ sends once
 *   ✓ resolves all promises
 *
 * =========================================================
 *
 * USAGE
 *
 * const batch = createBatcher({
 *   delay: 300,
 *   handler: async (items) => {
 *     return fetch("/api/bulk-expense", {
 *       method: "POST",
 *       body: JSON.stringify(items)
 *     })
 *   }
 * })
 *
 * await batch.push({ id: 1, amount: 200 })
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - generic
 * - works with any API
 * =========================================================
 */

type BatcherOptions<T, R> = {
  delay?: number
  handler: (items: T[]) => Promise<R>
}

type Pending<T, R> = {
  item: T
  resolve: (v: R) => void
  reject: (e: any) => void
}

/* =========================================================
   FACTORY
========================================================= */

export function createBatcher<T, R>({
  delay = 300,
  handler,
}: BatcherOptions<T, R>) {
  let queue: Pending<T, R>[] = []
  let timer: any = null

  /* ------------------------------------------------------
     FLUSH
  ------------------------------------------------------ */

  async function flush() {
    const current = [...queue]
    queue = []
    timer = null

    if (!current.length) return

    const items = current.map((p) => p.item)

    try {
      const result = await handler(items)

      current.forEach((p) => p.resolve(result))
    } catch (err) {
      current.forEach((p) => p.reject(err))
    }
  }

  /* ------------------------------------------------------
     PUSH
  ------------------------------------------------------ */

  function push(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      queue.push({ item, resolve, reject })

      if (!timer) {
        timer = setTimeout(flush, delay)
      }
    })
  }

  /* ------------------------------------------------------
     FORCE FLUSH (manual)
  ------------------------------------------------------ */

  function force() {
    if (timer) {
      clearTimeout(timer)
      flush()
    }
  }

  /* ------------------------------------------------------
     SIZE
  ------------------------------------------------------ */

  function size() {
    return queue.length
  }

  return {
    push,
    force,
    size,
  }
}
