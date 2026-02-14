"use client"

import { useState } from "react"

export default function IncomeCoachCard() {
  const [input, setInput] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  async function ask() {
    if (!input) return

    setLoading(true)

    const res = await fetch("/api/ai/income-coach", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    })

    const json = await res.json()

    setReply(json.text)
    setLoading(false)
  }

  return (
    <div className="p-4 border rounded-2xl bg-indigo-50 space-y-3">

      <h3 className="text-sm font-medium">
        🤖 Income Coach
      </h3>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your income..."
        className="w-full border rounded-lg p-2 text-sm"
      />

      <button
        onClick={ask}
        className="bg-black text-white text-sm px-3 py-2 rounded-lg"
      >
        Ask
      </button>

      {loading && <p className="text-xs">Thinking...</p>}

      {reply && (
        <pre className="text-xs whitespace-pre-wrap bg-white p-2 rounded-lg">
          {reply}
        </pre>
      )}

    </div>
  )
}
