"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

/*
=========================================================
CONNECT GST BUTTON — CLIENT SAFE
✓ browser supabase only
✓ app router compatible
✓ same behavior as before
=========================================================
*/

export default function ConnectGST({
  orgId,
}: {
  orgId: string
}) {
  const [gstin, setGstin] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function connect() {
    if (!gstin) return

    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      await fetch("/api/gst/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          orgId,
          gstin,
        }),
      })

      alert("GST Connected ✅")
    } catch (err) {
      console.error(err)
      alert("Failed to connect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 flex-col sm:flex-row">
      <input
        placeholder="Enter GSTIN"
        value={gstin}
        onChange={(e) => setGstin(e.target.value)}
        className="input"
      />

      <button
        onClick={connect}
        disabled={loading}
        className="btn"
      >
        {loading ? "Connecting..." : "Connect GST"}
      </button>
    </div>
  )
}
