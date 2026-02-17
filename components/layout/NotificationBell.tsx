ï»¿"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Bell } from "lucide-react"

/* ==========================================================
   TYPES
========================================================== */

type Notice = {
  id: string
  message: string
  created_at: string
}

/* ==========================================================
   NOTIFICATION BELL ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â FINAL HARDENED

   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â null-safe supabase
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â stable callbacks
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â click outside close
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â scrollable list
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â no SSR crash
========================================================== */

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notice[]>([])

  /* ========================================================
     LOAD
  ======================================================== */

  const load = useCallback(async () => {
    if (!supabase) return

    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user) return

    const { data } = await supabase
      .from("notifications")
      .select("id,message,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    setItems(data || [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  /* ========================================================
     CLOSE ON OUTSIDE CLICK
  ======================================================== */

  useEffect(() => {
    const close = () => setOpen(false)

    if (open) window.addEventListener("click", close)

    return () => window.removeEventListener("click", close)
  }, [open])

  /* ========================================================
     CLEAR
  ======================================================== */

  const markRead = async () => {
    if (!supabase) return

    const { data: auth } = await supabase.auth.getUser()
    const user = auth?.user
    if (!user) return

    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.id)

    setItems([])
    setOpen(false)
  }

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded-lg hover:bg-zinc-100 transition"
      >
        <Bell size={18} />

        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <Card
          className="
            absolute right-0 mt-2
            w-72
            p-3 space-y-3
            max-h-80 overflow-y-auto
            z-50
          "
        >
          {items.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">
              No alerts
            </p>
          ) : (
            <>
              {items.map((n) => (
                <div
                  key={n.id}
                  className="text-xs text-zinc-700 border-b last:border-0 pb-2"
                >
                  {n.message}
                </div>
              ))}

              <button
                onClick={markRead}
                className="text-xs text-center underline text-zinc-600 hover:text-zinc-900 pt-2"
              >
                Clear all
              </button>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
