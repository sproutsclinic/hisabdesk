"use client"

/**
 * =========================================================
 * Presence Indicator (Who is Online Now)
 * HisabDesk – Phase E (Realtime Collaboration)
 * =========================================================
 *
 * PURPOSE
 * Show which team members are currently online
 *
 *   ✓ live presence
 *   ✓ CA + client visibility
 *   ✓ multi-user awareness
 *   ✓ "Google Docs style" experience
 *
 * FEATURES
 *   ✓ shows avatars / initials
 *   ✓ realtime join/leave
 *   ✓ auto cleanup on disconnect
 *
 * CONNECTS TO
 *   Supabase Realtime Presence channel
 *   organization_members table
 *
 * SAFE
 * - client only
 * - read only
 * - plug & play
 *
 * =========================================================
 *
 * USAGE
 *
 * <PresenceIndicator orgId={orgId} />
 *
 * Put in:
 *   ✓ dashboard header
 *   ✓ CA portal
 *   ✓ team workspace
 *
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type User = {
  id: string
  name: string
}

export default function PresenceIndicator({
  orgId,
}: {
  orgId: string
}) {
  const [online, setOnline] = useState<User[]>([])

  /* ======================================================
     LOAD MEMBERS (names)
  ====================================================== */

  async function loadMembers(): Promise<
    Record<string, string>
  > {
    const { data } = await supabase
      .from("organization_members")
      .select("user_id, profiles(name)")
      .eq("org_id", orgId)

    const map: Record<string, string> = {}

    for (const row of data || []) {
      map[row.user_id] =
        row.profiles?.name || "User"
    }

    return map
  }

  /* ======================================================
     PRESENCE CHANNEL
  ====================================================== */

  useEffect(() => {
    if (!orgId) return

    let memberMap: Record<string, string> = {}

    let channel: any

    async function init() {
      memberMap = await loadMembers()

      channel = supabase.channel(
        `presence-${orgId}`,
        {
          config: {
            presence: { key: crypto.randomUUID() },
          },
        }
      )

      /* track self */
      await channel.track({
        online_at: new Date().toISOString(),
      })

      /* sync presence */
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()

        const users: User[] = []

        Object.keys(state).forEach((key) => {
          users.push({
            id: key,
            name: memberMap[key] || "User",
          })
        })

        setOnline(users)
      })

      channel.subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [orgId])

  /* ======================================================
     UI
  ====================================================== */

  if (!online.length) return null

  return (
    <div className="flex items-center gap-2">
      {online.map((u) => (
        <Avatar key={u.id} name={u.name} />
      ))}

      <span className="text-xs text-gray-500 ml-1">
        {online.length} online
      </span>
    </div>
  )
}

/* ======================================================
   AVATAR
====================================================== */

function Avatar({ name }: { name: string }) {
  const initial = name?.charAt(0)?.toUpperCase() || "U"

  return (
    <div className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center">
      {initial}
    </div>
  )
}
