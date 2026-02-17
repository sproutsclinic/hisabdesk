ï»¿"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/* ==========================================================
   MODAL SYSTEM ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Fintech Grade (Enterprise Safe)
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
        {/* ===== Header (always rendered ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â TS safe) ===== */}
        <div className="flex items-center justify-between mb-4">
          {title ? (
            <h3 className="text-sm font-semibold">{title}</h3>
          ) : (
            <span />
          )}

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-100"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ===== Content ===== */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
