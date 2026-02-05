"use client"

import { useRef } from "react"
import { useToast } from "@/components/ui/toast"

/* =================================================
   UNDO DELETE HOOK — Fintech Safe UX

   Purpose:
   ✅ prevents accidental delete loss
   ✅ shows Undo toast
   ✅ delays DB delete
   ✅ works for vault / transactions / docs

   Usage:

   const undoDelete = useUndoDelete()

   undoDelete({
     label: "Transaction deleted",
     onConfirm: () => deleteFromDB(id)
   })

================================================= */

type UndoOptions = {
  label?: string
  delay?: number
  onConfirm: () => Promise<void> | void
}

export function useUndoDelete() {
  const toast = useToast()
  const timer = useRef<NodeJS.Timeout | null>(null)

  const run = ({ label = "Deleted", delay = 3000, onConfirm }: UndoOptions) => {
    let cancelled = false

    timer.current = setTimeout(async () => {
      if (!cancelled) await onConfirm()
    }, delay)

    toast.info(
      `${label} • Undo?`
    )

    /* return undo function */
    return () => {
      cancelled = true
      if (timer.current) clearTimeout(timer.current)
      toast.success("Restored")
    }
  }

  return run
}
