ï»¿"use client"

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react"

import Toast from "@/components/ui/toast"

/* ==========================================================
   TYPES
========================================================== */

type ToastType = "info" | "success" | "error"

type ToastContextType = {
  show: (message: string, duration?: number, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

/* ==========================================================
   HOOK
========================================================== */

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider")
  }
  return ctx
}

/* ==========================================================
   PROVIDER
   Enterprise Hardened

   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ browser-safe timers
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ queued toasts
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ duplicate prevention
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ max queue size
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ type support (success/error/info)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ accessibility
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ cleanup safe
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ no memory leaks
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ backward compatible
========================================================== */

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
  } | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const queueRef = useRef<
    { message: string; type: ToastType; duration: number }[]
  >([])

  const lastMessageRef = useRef<string | null>(null)

  const MAX_QUEUE = 5

  /* ======================================================
     SHOW
     Backward compatible:
     show("Saved")
     show("Saved", 2000)
     show("Saved", 2000, "success")
  ====================================================== */

  const show = useCallback(
    (
      message: string,
      duration: number = 2200,
      type: ToastType = "info"
    ) => {
      // prevent duplicate spam
      if (message === lastMessageRef.current) return
      lastMessageRef.current = message

      const payload = { message, type, duration }

      // if visible ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ queue
      if (toast) {
        if (queueRef.current.length < MAX_QUEUE) {
          queueRef.current.push(payload)
        }
        return
      }

      setToast({ message, type })

      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(() => {
        setToast(null)
      }, duration)
    },
    [toast]
  )

  /* ======================================================
     WHEN CLOSED ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ SHOW NEXT
  ====================================================== */

  useEffect(() => {
    if (!toast && queueRef.current.length > 0) {
      const next = queueRef.current.shift()
      if (next) show(next.message, next.duration, next.type)
    }
  }, [toast, show])

  /* ======================================================
     CLEANUP
  ====================================================== */

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 pointer-events-none"
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type} // safe additive prop (optional in component)
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </ToastContext.Provider>
  )
}
