"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import {
  Gift,
  Copy,
  Users,
  Sparkles,
  CheckCircle,
} from "lucide-react"

/* =================================================
   REFERRALS PAGE — PHASE 10 FINAL

   ✅ unique code
   ✅ copy invite link
   ✅ referral counter
   ✅ claim code input
   ✅ mobile-first
   ✅ production safe
================================================= */

export default function ReferralPage() {
  const router = useRouter()
  const toast = useToast()

  const [loading, setLoading] = useState(true)

  const [code, setCode] = useState("")
  const [count, setCount] = useState(0)

  /* NEW */
  const [claimCode, setClaimCode] = useState("")
  const [claiming, setClaiming] = useState(false)

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

    /* ensure referral code exists */
    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user.id)
      .single()

    let referralCode = profile?.referral_code

    if (!referralCode) {
      referralCode = crypto.randomUUID().slice(0, 8).toUpperCase()

      await supabase
        .from("profiles")
        .update({ referral_code: referralCode })
        .eq("id", user.id)
    }

    setCode(referralCode)

    /* count successful referrals */
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", referralCode)

    setCount(count || 0)

    setLoading(false)
  }

  /* ================= HELPERS ================= */

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : ""

  const inviteLink = `${baseUrl}/signup?ref=${code}`

  const copy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    toast.success("Invite link copied")
  }

  /* ================= CLAIM ================= */

  const claim = async () => {
    if (!claimCode) return

    try {
      setClaiming(true)

      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token

      const res = await fetch("/api/referrals/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: claimCode }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || "Invalid code")
        return
      }

      toast.success("1 month Pro unlocked 🎉")
      setClaimCode("")
      load()
    } finally {
      setClaiming(false)
    }
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-8 max-w-xl">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Gift size={18} />
          Refer & Earn
        </h1>

        <p className="text-sm text-zinc-500">
          Invite friends. Both get 1 month FREE.
        </p>
      </div>

      {/* Stats */}
      <Card className="space-y-3 text-center">

        <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
          <Users size={16} />
          Successful Referrals
        </div>

        <p className="text-3xl font-bold">{count}</p>

        <p className="text-xs text-zinc-500">
          {count} month{count !== 1 ? "s" : ""} free earned
        </p>

      </Card>

      {/* Invite */}
      <Card className="space-y-4">

        <p className="text-xs text-zinc-500">
          Share your personal invite link
        </p>

        <div className="flex gap-2">
          <input readOnly value={inviteLink} className="input text-xs" />

          <Button size="sm" onClick={copy}>
            <Copy size={14} />
          </Button>
        </div>

      </Card>

      {/* Claim code */}
      <Card className="space-y-3">

        <p className="text-xs text-zinc-500">
          Have a referral code?
        </p>

        <div className="flex gap-2">
          <input
            value={claimCode}
            onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            className="input text-xs"
          />

          <Button size="sm" loading={claiming} onClick={claim}>
            Claim
          </Button>
        </div>

      </Card>

      {/* How it works */}
      <Card className="space-y-3 text-xs text-zinc-500">

        <div className="flex items-center gap-2 font-medium text-green-600">
          <Sparkles size={14} />
          How it works
        </div>

        <ul className="space-y-1 list-disc pl-4">
          <li>Friend signs up using your link</li>
          <li>They upgrade to Pro</li>
          <li>You both get 1 month FREE</li>
        </ul>

      </Card>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1 text-xs text-zinc-400">
        <CheckCircle size={12} />
        Automatic • Secure • Instant rewards
      </div>

    </div>
  )
}
