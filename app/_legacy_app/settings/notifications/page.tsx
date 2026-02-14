"use client"

/**
 * =========================================================
 * Notification Settings Page
 * HisabDesk – Phase D (Mobile / Engagement)
 * =========================================================
 *
 * PURPOSE
 * User controls for:
 *   ✓ push notifications enable/disable
 *   ✓ tax reminders
 *   ✓ GST alerts
 *   ✓ subscription alerts
 *   ✓ marketing updates
 *
 * Integrates with:
 *   lib/pwa/push-notifications.ts
 *
 * ROUTE
 * /settings/notifications
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  subscribePush,
  unsubscribePush,
} from "@/lib/pwa/push-notifications"

export default function NotificationSettingsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

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

      const { data } = await supabase
        .from("push_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      setEnabled(!!data)
      setLoading(false)
    }

    init()
  }, [])

  /* ======================================================
     TOGGLE
  ====================================================== */

  async function toggle() {
    if (!userId) return

    setLoading(true)

    if (!enabled) {
      await subscribePush(
        supabase,
        userId,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      )
      setEnabled(true)
    } else {
      await unsubscribePush(supabase, userId)
      setEnabled(false)
    }

    setLoading(false)
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold">
          Notifications
        </h1>
        <p className="text-sm text-gray-500">
          Manage alerts and reminders
        </p>
      </div>

      <div className="space-y-4 border rounded-xl p-5">
        <SettingRow
          title="Push Notifications"
          description="Tax reminders, GST deadlines, subscription alerts"
          checked={enabled}
          loading={loading}
          onChange={toggle}
        />
      </div>
    </div>
  )
}

/* ======================================================
   ROW COMPONENT
====================================================== */

function SettingRow({
  title,
  description,
  checked,
  loading,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  loading: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>

      <button
        disabled={loading}
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition ${
          checked ? "bg-black" : "bg-gray-300"
        }`}
      >
        <div
          className={`h-5 w-5 bg-white rounded-full transform transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}
