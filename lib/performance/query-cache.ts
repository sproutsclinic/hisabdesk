ï»¿"use client"

/*
=========================================================
SMART QUERY CACHE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ENTERPRISE VERSION
Phase F ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Performance Hardened

Upgrades:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ stale-while-revalidate
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ LRU eviction
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ TTL expiry
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ dedupe requests
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ background refresh
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ prefix invalidation
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ prefetch
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ memory safe

Drop-in replacement (backward compatible)
=========================================================
*/

type CacheEntry<T> = {
  data?: T
  ts: number
  promise?: Promise<T>
  refreshing?: boolean
}

/* ====================================================== */

const store = new Map<string, CacheEntry<any>>()

const MAX_CACHE_ITEMS = 200 // prevent memory leak

/* ======================================================
HELPERS
====================================================== */

function keyToString(key: any[]) {
  return key.join(":")
}

function evictIfNeeded() {
  if (store.size <= MAX_CACHE_ITEMS) return

  // simple LRU: remove oldest
  let oldestKey: string | null = null
  let oldestTs = Infinity

  for (const [k, v] of store) {
    if (v.ts < oldestTs) {
      oldestKey = k
      oldestTs = v.ts
    }
  }

  if (oldestKey) store.delete(oldestKey)
}

/* ======================================================
OPTIONS
====================================================== */

type Options<T> = {
  key: any[]
  ttl?: number
  query: () => Promise<T>
  background?: boolean
}

/* ======================================================
MAIN
====================================================== */

export async function cachedQuery<T>({
  key,
  ttl = 30_000,
  query,
  background = true,
}: Options<T>): Promise<T> {
  const k = keyToString(key)
  const now = Date.now()

  const cached = store.get(k)

  /* ---------------------------------------------------
     FRESH CACHE
  --------------------------------------------------- */

  if (cached?.data && now - cached.ts < ttl) {
    return cached.data
  }

  /* ---------------------------------------------------
     STALE CACHE (serve instantly + refresh)
  --------------------------------------------------- */

  if (cached?.data && background) {
    refreshInBackground(k, query)
    return cached.data
  }

  /* ---------------------------------------------------
     DEDUPE
  --------------------------------------------------- */

  if (cached?.promise) {
    return cached.promise
  }

  /* ---------------------------------------------------
     FETCH
  --------------------------------------------------- */

  const promise = safeQuery(query).then((data) => {
    store.set(k, {
      data,
      ts: Date.now(),
    })

    evictIfNeeded()

    return data
  })

  store.set(k, {
    ...(cached || {}),
    promise,
    ts: now,
  })

  return promise
}

/* ======================================================
BACKGROUND REFRESH
====================================================== */

function refreshInBackground<T>(
  key: string,
  query: () => Promise<T>
) {
  const entry = store.get(key)

  if (!entry || entry.refreshing) return

  entry.refreshing = true

  safeQuery(query)
    .then((data) => {
      store.set(key, {
        data,
        ts: Date.now(),
      })
    })
    .finally(() => {
      const e = store.get(key)
      if (e) e.refreshing = false
    })
}

/* ======================================================
PREFETCH
====================================================== */

export async function prefetchQuery<T>(
  key: any[],
  query: () => Promise<T>
) {
  const k = keyToString(key)

  if (store.has(k)) return

  const data = await query()

  store.set(k, {
    data,
    ts: Date.now(),
  })
}

/* ======================================================
INVALIDATE
====================================================== */

export function invalidateQuery(key: any[]) {
  store.delete(keyToString(key))
}

/*
Invalidate all keys with prefix
Example:
invalidatePrefix(["gst", orgId])
*/

export function invalidatePrefix(prefix: any[]) {
  const p = keyToString(prefix)

  for (const k of store.keys()) {
    if (k.startsWith(p)) {
      store.delete(k)
    }
  }
}

/* ======================================================
CLEAR
====================================================== */

export function clearQueryCache() {
  store.clear()
}

/* ======================================================
SAFE WRAPPER
====================================================== */

async function safeQuery<T>(fn: () => Promise<T>) {
  try {
    return await fn()
  } catch (e) {
    throw e
  }
}
