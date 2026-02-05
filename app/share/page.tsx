"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Share2, Sparkles } from "lucide-react"

/* =================================================
   SAVINGS SHARE PAGE — Viral Growth

   Purpose:
   ✅ show “I saved ₹XX tax”
   ✅ 1-tap share
   ✅ emotional proof
   ✅ drives referrals

================================================= */

export default function SharePage() {
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase
      .from("dashboard_cache")
      .select("savings")
      .single()

    setSavings(data?.savings || 0)
  }

  const share = async () => {
    const text =
      `I saved ₹${savings.toLocaleString("en-IN")} in taxes using HisabDesk 💚\nTry it free:\nhttps://hisabdesk.com`

    if (navigator.share) {
      navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert("Copied to clipboard")
    }
  }

  return (
    <div className="max-w-md space-y-8">

      <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50">

        <Sparkles className="mx-auto mb-3 text-green-600" />

        <p className="text-sm text-zinc-500">Tax Saved This Year</p>

        <p className="text-3xl font-bold text-green-700">
          ₹ {savings.toLocaleString("en-IN")}
        </p>

      </Card>

      <Button className="w-full" onClick={share}>
        <Share2 size={16} />
        Share with friends
      </Button>

    </div>
  )
}
