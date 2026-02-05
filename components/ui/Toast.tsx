"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

/* ========================================
   TOAST SYSTEM — Fintech Grade

   Features:
   ✅ success / error / info
   ✅ auto dismiss
   ✅ stack
   ✅ mobile safe
   ✅ zero deps

   Usage:

   const toast = useToast()

   toast.success("Saved successfully")
   toast.error("Upload failed")
======================================== */

type Variant = "success" | "error" | "info"

type ToastItem = {
  id: string
  title: string
  variant: Variant
}

type ToastContextType = {
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

/* ================= HOOK ================= */

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}

/* ================= PROVIDER ================= */

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const push = useCallback((title: string, variant: Variant) => {
    const id = crypto.randomUUID()

    setToasts((prev) => [...prev, { id, title, variant }])

    setTimeout(() => remove(id), 3500)
  }, [])

  const api: ToastContextType = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* ===== Toast Stack ===== */}
      <div
        className="
          fixed
          bottom-24 md:bottom-6
          left-1/2 -translate-x-1/2
          z-[100]
          space-y-2
          w-[92%] max-w-sm
          pointer-events-none
        "
      >
        {toasts.map((t) => (
          <Toast key={t.id} item={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/* ================= TOAST ================= */

function Toast({
  item,
  onClose,
}: {
  item: ToastItem
  onClose: () => void
}) {
  const styles: Record<Variant, string> = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-zinc-900 text-white",
  }

  const Icon =
    item.variant === "success"
      ? CheckCircle2
      : item.variant === "error"
      ? AlertCircle
      : Info

  return (
    <div
      className={cn(
        `
        pointer-events-auto
        flex items-center gap-3
        rounded-xl
        px-4 py-3
        text-sm font-medium
        shadow-lg
        animate-in fade-in slide-in-from-bottom-3
        `,
        styles[item.variant]
      )}
    >
      <Icon size={16} />

      <span className="flex-1">{item.title}</span>

      <button
        onClick={onClose}
        className="opacity-80 hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  )
}
