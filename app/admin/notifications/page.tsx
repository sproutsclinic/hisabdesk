ï»¿"use client"

/**
 * =========================================================
 * Admin Notification Broadcast Center
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Enterprise Admin Control
 * =========================================================
 *
 * ROUTE
 *   /admin/notifications
 *
 * PURPOSE
 * Send announcements to users:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ maintenance alerts
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ product updates
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ billing notices
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ marketing messages
 *
 * Sends to:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ all users
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ or specific user
 *
 * STORES INTO
 *   notifications table
 *
 * CONNECTS TO
 *   components/notifications/notification-center.tsx
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [userId, setUserId] = useState("")
  const [sending, setSending] = useState(false)

  /* ======================================================
     SEND
  ====================================================== */

  async function send() {
    if (!title || !body) return

    setSending(true)

    if (userId) {
      /* single user */
      await supabase.from("notifications").insert({
        user_id: userId,
        title,
        body,
      })
    } else {
      /* broadcast all users */
      const { data: users } = await supabase
        .from("profiles")
        .select("id")

      if (users?.length) {
        const rows = users.map((u: any) => ({
          user_id: u.id,
          title,
          body,
        }))

        await supabase.from("notifications").insert(rows)
      }
    }

    setTitle("")
    setBody("")
    setUserId("")
    setSending(false)

    alert("Sent successfully")
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold">
          Notification Broadcast
        </h1>
        <p className="text-sm text-gray-500">
          Send alerts to users
        </p>
      </div>

      <div className="border rounded-xl p-5 space-y-4">
        <Field
          label="Title"
          value={title}
          onChange={setTitle}
        />

        <Field
          label="Message"
          value={body}
          onChange={setBody}
        />

        <Field
          label="User ID (optional ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ leave blank to broadcast)"
          value={userId}
          onChange={setUserId}
        />

        <button
          onClick={send}
          disabled={sending}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  )
}

/* ======================================================
   FIELD
====================================================== */

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full"
      />
    </div>
  )
}
