ï»¿"use client"

import { useEffect, useState } from "react"

export function useNotifications() {
  const [rows, setRows] = useState<any[]>([])
  const [unread, setUnread] = useState(0)

  const load = async () => {
    const res = await fetch("/api/notifications")
    const json = await res.json()

    setRows(json.data.rows)
    setUnread(json.data.unread)
  }

  const markRead = async () => {
    await fetch("/api/notifications/read", {
      method: "POST",
    })

    load()
  }

  useEffect(() => {
    load()
  }, [])

  return { rows, unread, markRead }
}
