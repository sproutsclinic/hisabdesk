"use client"

import { useState } from "react"

export function useBillsAI() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const ask = async (summary: string) => {
    setLoading(true)

    const res = await fetch("/api/ai/bills/optimize", {
      method: "POST",
      body: JSON.stringify({ summary }),
    })

    const json = await res.json()

    setText(json.text)
    setLoading(false)
  }

  return { text, loading, ask }
}
