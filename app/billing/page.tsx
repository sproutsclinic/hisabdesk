"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Billing() {

  const [userId, setUserId] = useState<string | null>(null)

  // =========================
  // LOAD USER ONCE
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data.user?.id || null)
    }

    loadUser()

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  // =========================
  // START SUBSCRIPTION
  // =========================
  const startSubscription = async () => {
    try {
      if (!userId) return alert("Please login first")

      const res = await fetch("/api/razorpay", { method: "POST" })
      const data = await res.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        subscription_id: data.id,
        name: "HisabDesk Pro",
        description: "Monthly Subscription",

        handler: async function (response: any) {

          // Save subscription (server handles DB)
          await fetch("/api/save-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              subscriptionId: response.razorpay_subscription_id
            })
          })

          // Upgrade to pro
          await fetch("/api/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
          })

          alert("🎉 Pro Activated Successfully")

          window.location.href = "/tax/documents"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error(err)
      alert("Payment failed. Try again.")
    }
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Upgrade to Pro</h1>

      <div className="bg-green-100 p-6 rounded space-y-4 w-80">
        <h2 className="text-xl font-bold">₹199 / month</h2>

        <ul className="text-sm space-y-1">
          <li>✅ AI Advisor</li>
          <li>✅ Tax Reports PDF</li>
          <li>✅ Smart Tax Suggestions</li>
          <li>✅ Bank Statement Import</li>
        </ul>

        <button
          onClick={startSubscription}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}
