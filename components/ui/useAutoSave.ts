"use client"

import { useEffect, useRef } from "react"

/* =================================================
   AUTO SAVE HOOK — Enterprise Safe

   Fixes:
   ✅ no NodeJS types (browser safe)
   ✅ SSR safe
   ✅ debounced
   ✅ no memory leaks
   ✅ stable deps
   ✅ prevents parallel saves

   Usage:
   useAutoSave(data, async (v) => await save(v))
================================================= */

export function useAutoSave<T>(
  value: T,
  saveFn: (v: T) => Promise<void>,
  delay = 800
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saving = useRef(false)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(async () => {
      if (saving.current) return

      try {
        saving.current = true
        await saveFn(value)
      } finally {
        saving.current = false
      }
    }, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [value, delay, saveFn])
}
