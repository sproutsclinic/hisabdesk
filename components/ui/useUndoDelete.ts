ï»¿"use client"

import { useRef } from "react"
import { useToast } from "@/components/providers/ToastProvider"

/* ==========================================================
   useUndoDelete ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â aligned with ToastProvider.show()
========================================================== */

export function useUndoDelete() {
  const { show } = useToast()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scheduleDelete(
    action: () => void,
    label: string,
    delay = 5000
  ) {
    timerRef.current = setTimeout(() => {
      action()
      timerRef.current = null
    }, delay)

    // IMPORTANT: template string must remain intact
    show(`${label} deleted. Undo?`, delay, "info")

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
        show(`${label} restored`, 2000, "success")
      }
    }
  }

  return { scheduleDelete }
}
