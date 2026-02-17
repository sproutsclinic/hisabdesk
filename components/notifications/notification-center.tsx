ï»¿"use client"

/**
 * =========================================================
 * Notification Center (In-App Alerts Panel)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Enterprise UX Layer
 * =========================================================
 *
 * PURPOSE
 * Central inbox for:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ GST reminders
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ subscription alerts
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ referral rewards
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ system messages
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ admin notices
 *
 * WHY
 * Push is unreliable.
 * In-app inbox is permanent + auditable.
 *
 * FEATURES
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ bell icon
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ unread count
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ mark as read
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ delete
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ realtime friendly
 *
 * SAFE
 * - client only
 * - no existing files modified
 *
 * REQUIRED TABLE (Supabase SQL)
 *
 * create table notifications (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid,
 *   title text,
 *   body text,
 *   read boolean default false,
 *   created_at timestamp default now()
 * );
 *
 * =========================================================
 *
 * USAGE
 *
 * <NotificationCenter />
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Notification = {
  id: string
  title: string
  body: string
  read: boolean
  created_at: string
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  /* ======================================================
     LOAD USER
  ====================================================== */

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUserId(user.id)
      load(user.id)
    }

    init()
  }, [])

  /* ======================================================
     LOAD NOTIFICATIONS
  ====================================================== */

  async function load(uid: string) {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(50)

    setItems(data || [])
  }

  /* ======================================================
     MARK READ
  ====================================================== */

  async function markRead(id: string) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)

    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  /* ======================================================
     DELETE
  ====================================================== */

  async function remove(id: string) {
    await supabase
      .from("notifications")
      .delete()
      .eq("id", id)

    setItems((prev) =>
      prev.filter((n) => n.id !== id)
    )
  }

  const unread = items.filter((i) => !i.read).length

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="relative">
      {/* BELL */}
      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â

        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {/* PANEL */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-xl z-50 max-h-96 overflow-auto">
          <div className="p-3 border-b font-medium">
            Notifications
          </div>

          {items.map((n) => (
            <div
              key={n.id}
              className={`p-3 border-b text-sm ${
                !n.read ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex justify-between">
                <p className="font-medium">
                  {n.title}
                </p>

                <button
                  onClick={() => remove(n.id)}
                  className="text-xs text-gray-400"
                >
                  ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-1">
                {n.body}
              </p>

              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>
                  {new Date(
                    n.created_at
                  ).toLocaleString()}
                </span>

                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="underline"
                  >
                    mark read
                  </button>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No notifications
            </p>
          )}
        </div>
      )}
    </div>
  )
}
