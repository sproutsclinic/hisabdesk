"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { track } from "@/lib/analytics"

export default function Billing() {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data.user?.id || null)
    }

    loadUser()
    track("begin_checkout")

    /* ✅ Razorpay script safe load */
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  /* ================= START SUBSCRIPTION ================= */

  const startSubscription = async () => {
    try {
      if (!userId) {
        router.push("/login")
        return
      }

      setLoading(true)

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const sub = await res.json()

      if (!res.ok || !sub?.id) {
        alert(sub?.error || "Unable to start subscription")
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: sub.id,

        name: "HisabDesk Pro",
        description: "AI + Vault Protection Plan",

        theme: { color: "#000000" },

        handler: () => {
          alert("✅ Payment successful. Pro activated!")
          router.replace("/dashboard")
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert("Payment failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <main className="container-app py-16 space-y-14 min-h-screen bg-gray-50">

      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Upgrade to Pro 🚀</h1>
        <p className="text-sm text-gray-500">
          Unlock intelligence + protection for your family finances
        </p>
      </section>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

        {/* FREE */}
        <div className="card space-y-6">
          <h3 className="font-semibold text-lg">Free</h3>

          <p className="text-3xl font-bold">₹0</p>

          <ul className="text-sm text-gray-500 space-y-2">
            <li>✓ Income & expense tracking</li>
            <li>✓ Basic tax calculator</li>
            <li>✓ 5 vault uploads only</li>
          </ul>

          <button
            onClick={() => router.push("/dashboard")}
            className="btn-outline w-full"
          >
            Continue Free
          </button>
        </div>

        {/* PRO */}
        <div className="card border-2 border-black space-y-6 relative">

          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-medium">
            MOST POPULAR
          </span>

          <h3 className="font-semibold text-lg">Pro</h3>

          <p className="text-3xl font-bold">
            ₹199 <span className="text-sm">/ month</span>
          </p>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ AI Smart Insights</li>
            <li>✓ Risk & safety alerts</li>
            <li>✓ Vault backup export (ZIP)</li>
            <li>✓ Family sharing links</li>
            <li>✓ PDF reports</li>
            <li>✓ Unlimited uploads</li>
          </ul>

          <button
            onClick={startSubscription}
            disabled={loading}
            className="btn w-full"
          >
            {loading ? "Processing..." : "Upgrade Now →"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <section className="text-center text-xs text-gray-400">
        🔒 Secure payments • Cancel anytime • No hidden charges
      </section>
    </main>
  )
}
