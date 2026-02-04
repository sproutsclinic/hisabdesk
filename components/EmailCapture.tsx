"use client"

import { useState } from "react"

export default function EmailCapture() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email) return

    setLoading(true)

    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="bg-green-50 border p-4 rounded-xl text-sm">
        ✅ Thanks! We’ll send tax tips & updates.
      </div>
    )
  }

  return (
    <div className="border rounded-2xl p-6 bg-gray-50 space-y-3">
      <p className="font-medium">
        📩 Get free tax saving tips & updates
      </p>

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />

        <button
          onClick={submit}
          className="bg-black text-white px-4 rounded-lg"
        >
          {loading ? "..." : "Join"}
        </button>
      </div>
    </div>
  )
}
