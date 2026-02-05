"use client"

import { useEffect, useState } from "react"

export default function SyncStatus() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const now = new Date()
    setTime(
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    )
  }, [])

  return (
    <span className="text-xs text-zinc-500">
      Synced {time}
    </span>
  )
}
