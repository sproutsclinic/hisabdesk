"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/* ==========================================================
   MODAL SYSTEM — Fintech Grade (Enterprise Safe)

   Goals:
   • clean accounting UI
   • centered dialog
   • ESC close
   • backdrop click close
   • mobile safe
   • no animation noise
   • accessible
========================================================== */

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

/* ================= ROOT ================= */

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  /* ESC close */
  React.useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">

      {/* ===== Backdrop ===== */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* ===== Dialog ===== */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          `
          relative
          w-[95%] max-w-lg
          bg-white
          rounded-2xl
          border border-zinc-200
          shadow-xl
          p-5
          `,
          className
        )}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h3 className="text-sm font-semibold">{title}</h3>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-zinc-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
