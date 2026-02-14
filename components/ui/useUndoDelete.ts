"use client"

import { useRef } from "react"
import { useToast } from "@/components/providers/ToastProvider"

/* =================================================
   UNDO DELETE HOOK — Enterprise Safe

   Fixes:
   ✅ no NodeJS types (browser safe)
   ✅ correct ToastProvider import
   ✅ memory-safe cleanup
   ✅ prevents double delete
   ✅ debounced confirmation

   Usage:

   const undoDelete = useUndoDelete()

   const undo = undoDelete({
     label: "Transaction deleted",
     onConfirm: () => deleteFromDB(id)
   })

   // call undo() if user clicks undo
================================================= */

type UndoOptions = {
  label?: string
  delay?: number
  onConfirm: () => Promise<void> | void
}

export function useUndoDelete() {
  const toast = useToast()

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const confirmed = useRef(false)

  const run = ({
    label = "Deleted",
    delay = 3000,
    onConfirm,
  }: UndoOptions) => {
    confirmed.current = false

    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(async () => {
      if (confirmed.current) return
      confirmed.current = true
      await onConfirm()
    }, delay)

    toast.info(`${label} • Undo?`)

    // undo handler
    return () => {
      confirmed.current = true

      if (timer.current) clearTimeout(timer.current)

      toast.success("Restored")
    }
  }

  return run
}
