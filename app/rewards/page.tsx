ï»¿"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Gift,
  Sparkles,
  Trophy,
  CalendarDays,
  ArrowRight,
} from "lucide-react"

/* =================================================
   REWARDS PAGE ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Phase 11 (Monetization Layer)

   Purpose:
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ show free months earned
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ show Pro expiry date
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ show progress
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ upsell referrals
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ builds motivation + retention

   Data:
   profiles:
     is_pro
     pro_expires_at
     referral_code

================================================= */

export default function RewardsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [isPro, setIsPro] = useState(false)
  const [expiry, setExpiry] = useState<string | null>(null)
  const [referrals, setReferrals] = useState(0)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      router.push("/login")
      return
    }

    /* profile */
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at, referral_code")
      .eq("id", user.id)
      .single()

    setIsPro(profile?.is_pro || false)
    setExpiry(profile?.pro_expires_at || null)

    /* count referrals */
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", profile?.referral_code)

    setReferrals(count || 0)

    setLoading(false)
  }

  /* ================= HELPERS ================= */

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Trophy size={18} />
          Rewards Center
        </h1>

        <p className="text-sm text-zinc-500">
          Track your free months & benefits
        </p>
      </div>

      {/* Pro status */}
      <Card className="space-y-3">

        <div className="flex items-center gap-2 font-medium text-indigo-600">
          <Sparkles size={16} />
          Pro Status
        </div>

        <p className="text-sm">
          {isPro ? "Active" : "Free Plan"}
        </p>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <CalendarDays size={14} />
          Valid till: {formatDate(expiry)}
        </div>

      </Card>

      {/* Referral rewards */}
      <Card className="space-y-4 text-center">

        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
          <Gift size={16} />
          Free Months Earned
        </div>

        <p className="text-3xl font-bold">
          {referrals}
        </p>

        <p className="text-xs text-zinc-500">
          {referrals} successful referral{referrals !== 1 && "s"}
        </p>

      </Card>

      {/* Action */}
      <Button
        className="w-full"
        onClick={() => router.push("/referral")}
      >
        Invite Friends & Earn More
        <ArrowRight size={14} />
      </Button>

      {/* Footer */}
      <p className="text-xs text-center text-zinc-400">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â½ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â 1 referral = 1 month FREE for both
      </p>

    </div>
  )
}
