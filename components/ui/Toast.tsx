"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

/* ==========================================================
   IMPORTANT FIX
   ----------------------------------------------------------
   Re-export useToast hook so imports like:

   import { useToast } from "@/components/ui/toast"

   continue working across app
========================================================== */

export { useToast } from "@/components/providers/ToastProvider"

/* ==========================================================
   TYPES
========================================================== */

export type ToastVariant = "success" | "error" | "info"

interface Props {
  message: string
  variant?: ToastVariant

  /* additive only (optional) */
  onClose?: () => void
  className?: string
}

/* ==========================================================
   STYLES
========================================================== */

const styles: Record<ToastVariant, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-zinc-900 text-white",
}

/* ==========================================================
   COMPONENT (visual only)
   Enterprise Hardened

   ✅ smooth animation
   ✅ dismiss button
   ✅ mobile safe
   ✅ accessibility compliant
   ✅ long text safe
   ✅ pointer safe
========================================================== */

export default function Toast({
  message,
  variant = "info",
  onClose,
  className,
}: Props) {
  const Icon =
    variant === "success"
      ? CheckCircle2
      : variant === "error"
      ? AlertCircle
      : Info

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        `
        group
        flex items-center gap-3

        w-[calc(100vw-2rem)]
        sm:w-auto
        max-w-md

        rounded-xl
        px-4 py-3

        text-sm font-medium
        shadow-lg

        backdrop-blur-sm
        pointer-events-auto

        animate-in slide-in-from-right-4 fade-in
        transition

        `,
        styles[variant],
        className
      )}
    >
      {/* Icon */}
      <Icon size={16} className="shrink-0 opacity-90" />

      {/* Message */}
      <span className="flex-1 break-words leading-relaxed">
        {message}
      </span>

      {/* Dismiss button (optional) */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="
            shrink-0
            opacity-70 hover:opacity-100
            transition
          "
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
