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
        body: JSON.stringify({ userId })
      })

      const sub = await res.json()

      /* 🔒 handle server error safely */
      if (!res.ok || !sub?.id) {
        alert(sub?.error || "Unable to start subscription")
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: sub.id,
        name: "HisabDesk Pro",
        description: "Monthly Subscription",

        /* webhook handles upgrade */
        handler: () => {
          alert("Payment successful. Activating Pro...")
          router.replace("/dashboard")
        }
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
    <main className="container-app py-16 space-y-12 min-h-screen bg-gray-50">

      <section className="text-center space-y-3">
        <h1 className="heading-xl">Upgrade to Pro 🚀</h1>
        <p className="muted">
          Unlock AI tax tools and file faster without CA.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

        {/* FREE */}
        <div className="card space-y-6">
          <h3 className="font-semibold text-lg">Free</h3>
          <p className="text-3xl font-bold">₹0</p>

          <button
            onClick={() => router.push("/dashboard")}
            className="btn-outline"
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

          <button
            onClick={startSubscription}
            disabled={loading}
            className="btn"
          >
            {loading ? "Processing..." : "Upgrade Now →"}
          </button>
        </div>
      </div>

      <section className="text-center text-sm text-gray-500">
        🔒 Secure payments • Cancel anytime • No hidden charges
      </section>

    </main>
  )
}
