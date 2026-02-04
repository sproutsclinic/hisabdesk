"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { track } from "@/lib/analytics"

export default function Billing() {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // =========================
  // LOAD USER + RAZORPAY SCRIPT
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data.user?.id || null)
    }
    track("begin_checkout")


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

      setLoading(true)

      const res = await fetch("/api/razorpay", { method: "POST" })
      const data = await res.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        subscription_id: data.id,
        name: "HisabDesk Pro",
        description: "Monthly Subscription",

        handler: async function (response: any) {
          await fetch("/api/save-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              subscriptionId: response.razorpay_subscription_id
            })
          })

          await fetch("/api/upgrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
          })

          alert("🎉 Pro Activated Successfully")
         track("purchase", {
  value: 199,
  currency: "INR",
  plan: "pro"
})


          window.location.href = "/dashboard"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()

      setLoading(false)

    } catch (err) {
      console.error(err)
      alert("Payment failed. Try again.")
      setLoading(false)
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">

      {/* HEADER */}
      <section className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">
          Upgrade to Pro 🚀
        </h1>

        <p className="text-gray-600">
          Unlock AI tax tools and file faster without CA.
        </p>
      </section>


      {/* PRICING CARDS */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* FREE PLAN */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm">

          <h3 className="text-xl font-semibold mb-2">Free</h3>

          <p className="text-3xl font-bold mb-6">₹0</p>

          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            <li>✅ Income tracking</li>
            <li>✅ Expense tracking</li>
            <li>✅ Basic tax calculator</li>
            <li>❌ AI Advisor</li>
            <li>❌ PDF reports</li>
            <li>❌ Bank import</li>
          </ul>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full border py-3 rounded-xl"
          >
            Continue Free
          </button>
        </div>


        {/* PRO PLAN */}
        <div className="bg-black text-white rounded-2xl p-8 shadow-xl scale-105 relative">

          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-medium">
            MOST POPULAR
          </span>

          <h3 className="text-xl font-semibold mb-2">Pro</h3>

          <p className="text-3xl font-bold mb-6">
            ₹199 <span className="text-sm font-normal">/ month</span>
          </p>

          <ul className="space-y-3 text-sm mb-8">
            <li>✅ AI Tax Advisor</li>
            <li>✅ PDF Reports</li>
            <li>✅ Smart Tax Saving Tips</li>
            <li>✅ Bank Statement Import (OCR)</li>
            <li>✅ Faster filing</li>
            <li>✅ Priority support</li>
          </ul>

          <button
            onClick={startSubscription}
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Processing..." : "Upgrade Now →"}
          </button>
        </div>
      </div>


      {/* TRUST LINE */}
      <section className="text-center mt-14 text-sm text-gray-500">
        🔒 Secure payments • Cancel anytime • No hidden charges
      </section>

    </main>
  )
}
