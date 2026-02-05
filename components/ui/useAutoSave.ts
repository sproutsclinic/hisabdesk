"use client"

import { useEffect, useRef } from "react"

/* =================================================
   AUTO SAVE HOOK — Silent persistence

   Purpose:
   ✅ autosave forms
   ✅ debounced
   ✅ mobile friendly
   ✅ reduces fear of data loss

   Usage:

   useAutoSave(data, async (v) => {
     await saveToDB(v)
   })

================================================= */

export function useAutoSave<T>(
  value: T,
  saveFn: (v: T) => Promise<void>,
  delay = 800
) {
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      saveFn(value)
    }, delay)

    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [value])
}
