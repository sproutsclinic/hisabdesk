"use client"

/**
 * =========================================================
 * Lazy Loader (Smart Data + Component Deferral)
 * HisabDesk – Phase F (Performance / Scale)
 * =========================================================
 *
 * PURPOSE
 * Load heavy data/components ONLY when needed.
 *
 * WITHOUT LAZY
 *   ❌ dashboard loads everything at once
 *   ❌ slow first paint
 *   ❌ wasted API calls
 *
 * WITH LAZY
 *   ✓ faster initial load
 *   ✓ fetch only when visible
 *   ✓ better Lighthouse score
 *   ✓ lower Supabase cost
 *
 * =========================================================
 *
 * FEATURES
 *
 *   ✓ lazyQuery()      → fetch only when visible
 *   ✓ lazyImport()     → dynamic component load
 *   ✓ useIntersection  → auto trigger on scroll
 *
 * Similar to:
 *   YouTube lazy loading
 *   Stripe dashboards
 *
 * =========================================================
 *
 * USAGE
 *
 * ---------- Lazy data ----------
 *
 * const { ref, data } = useLazyQuery({
 *   query: () => fetchReports()
 * })
 *
 * <div ref={ref}>...</div>
 *
 *
 * ---------- Lazy component ----------
 *
 * const Chart = lazyImport(() => import("./BigChart"))
 *
 * =========================================================
 *
 * SAFE
 * - client only
 * - zero backend impact
 * - reusable
 * =========================================================
 */

import { useEffect, useRef, useState } from "react"

/* =========================================================
   INTERSECTION HOOK
========================================================= */

function useIntersection(
  callback: () => void,
  rootMargin = "200px"
) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback()
          obs.disconnect()
        }
      },
      { rootMargin }
    )

    obs.observe(ref.current)

    return () => obs.disconnect()
  }, [ref.current])

  return ref
}

/* =========================================================
   LAZY QUERY
========================================================= */

type LazyQueryOptions<T> = {
  query: () => Promise<T>
}

/**
 * Fetch data only when element becomes visible
 */
export function useLazyQuery<T>({
  query,
}: LazyQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  async function run() {
    if (loading || data) return

    setLoading(true)
    const res = await query()
    setData(res)
    setLoading(false)
  }

  const ref = useIntersection(run)

  return {
    ref,
    data,
    loading,
  }
}

/* =========================================================
   LAZY IMPORT (component)
========================================================= */

/**
 * Lazy load heavy component
 *
 * Example:
 * const Chart = lazyImport(() => import("./Chart"))
 */
export function lazyImport<T>(
  loader: () => Promise<{ default: T }>
) {
  let Comp: any = null
  let promise: any = null

  return function Lazy(props: any) {
    const [, force] = useState(0)

    useEffect(() => {
      if (!promise) {
        promise = loader().then((m) => {
          Comp = m.default
          force((x) => x + 1)
        })
      }
    }, [])

    if (!Comp) return null

    return <Comp {...props} />
  }
}
