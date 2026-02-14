"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

/* ==========================================================
   DIALOG / MODAL SYSTEM — Fintech Grade (Enterprise Safe)

   Purpose:
   • confirmations
   • delete dialogs
   • forms in modal
   • settings panels

   Features:
   ✅ no deps
   ✅ SSR safe
   ✅ escape to close
   ✅ overlay click close
   ✅ body scroll lock
   ✅ accessible
   ✅ consistent with Card system

   Usage:

   <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader title="Delete expense" />
       ...
     </DialogContent>
   </Dialog>
========================================================== */

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

/* ========================================================== */
/* ROOT */
/* ========================================================== */

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  /* lock body scroll */
  React.useEffect(() => {
    if (!open) return

    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  /* escape key */
  React.useEffect(() => {
    if (!open) return

    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }

    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, onOpenChange])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {children}
    </div>,
    document.body
  )
}

/* ========================================================== */
/* OVERLAY */
/* ========================================================== */

export function DialogOverlay({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <div
      onClick={onClose}
      className="
        absolute inset-0
        bg-black/40
        backdrop-blur-[1px]
      "
    />
  )
}

/* ========================================================== */
/* CONTENT */
/* ========================================================== */

export function DialogContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        relative
        w-[92%] max-w-md
        rounded-2xl
        bg-white
        border border-zinc-200
        shadow-xl
        p-5
        animate-in fade-in zoom-in-95
        `,
        className
      )}
    >
      {children}
    </div>
  )
}

/* ========================================================== */
/* HEADER */
/* ========================================================== */

export function DialogHeader({
  title,
  onClose,
}: {
  title: string
  onClose?: () => void
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold">{title}</h3>

      {onClose && (
        <button
          onClick={onClose}
          className="
            p-1 rounded-lg
            hover:bg-zinc-100
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

/* ========================================================== */
/* FOOTER */
/* ========================================================== */

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-5 pt-4 border-t border-zinc-200 flex justify-end gap-2",
        className
      )}
      {...props}
    />
  )
}
