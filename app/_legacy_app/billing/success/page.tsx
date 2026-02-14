"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { ShieldCheck, Sparkles } from "lucide-react"

/* =================================================
   BILLING SUCCESS PAGE

   Purpose:
   ✅ shown after Razorpay success
   ✅ refresh user session
   ✅ ensure PRO reflected instantly
   ✅ redirect to dashboard
   ✅ calm trust-building screen

   Route:
   /billing/success
================================================= */

export default function BillingSuccessPage() {
  const router = useRouter()

  /* ================= AUTO REFRESH SESSION ================= */

  useEffect(() => {
    const refresh = async () => {
      // refresh session so latest profile/is_pro loads
      await supabase.auth.refreshSession()

      // small delay → smoother UX
      setTimeout(() => {
        router.replace("/dashboard")
      }, 2500)
    }

    refresh()
  }, [router])

  /* ================= UI ================= */

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 p-6">

      <Card className="max-w-md w-full text-center space-y-6 p-8">

        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <ShieldCheck size={28} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-semibold">
            Payment Successful 🎉
          </h1>

          <p className="text-sm text-zinc-600">
            Your HisabDesk Pro plan is now active
          </p>
        </div>

        <div className="text-xs text-green-700 flex items-center justify-center gap-1">
          <Sparkles size={12} />
          Unlocking AI + Protection features...
        </div>

        <Button
          onClick={() => router.replace("/dashboard")}
          className="w-full"
        >
          Go to Dashboard
        </Button>

      </Card>

    </main>
  )
}
