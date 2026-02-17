ï»¿"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import { Gift, Copy, Users, CheckCircle } from "lucide-react"

/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Referrals Page (Personal App Only)
   ---------------------------------------------------------
   UI Layer Only
   - No business logic
   - No calculations
   - No service imports
   - Talks directly to Supabase (allowed for simple UI flows)
========================================================= */

export default function ReferralPage() {
  const router = useRouter()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [referralCode, setReferralCode] = useState<string>("")
  const [referralCount, setReferralCount] = useState<number>(0)

  const [claimCode, setClaimCode] = useState("")
  const [claiming, setClaiming] = useState(false)

  /* =========================================================
     LOAD USER + REFERRAL INFO
  ========================================================= */

  useEffect(() => {
    loadReferralData()
  }, [])

  async function loadReferralData() {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      router.push("/login")
      return
    }

    /* ---------------- Ensure referral code exists ---------------- */

    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("user_id", user.id)
      .single()

    let code: string | null = profile?.referral_code ?? null

    if (!code) {
      code = crypto.randomUUID().slice(0, 8).toUpperCase()

      await supabase
        .from("profiles")
        .update({ referral_code: code })
        .eq("user_id", user.id)
    }

    setReferralCode(code)

    /* ---------------- Count successful referrals ---------------- */

    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", code)

    setReferralCount(count ?? 0)

    setLoading(false)
  }

  /* =========================================================
     COPY LINK
  ========================================================= */

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${referralCode}`
      : ""

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink)
    toast.show("Invite link copied", 2000)
  }

  /* =========================================================
     CLAIM REFERRAL
  ========================================================= */

  async function claimReferral() {
    if (!claimCode) return

    try {
      setClaiming(true)

      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token

      const res = await fetch("/api/referrals/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ code: claimCode }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.show(json.error ?? "Invalid code", 2500)
        return
      }

      toast.show("Reward unlocked ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â½ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â°", 2500)

      setClaimCode("")
      loadReferralData()
    } finally {
      setClaiming(false)
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="max-w-xl space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Gift size={18} />
          Refer & Earn
        </h1>

        <p className="text-sm text-zinc-500">
          Invite friends. Both get 1 month FREE.
        </p>
      </div>

      {/* Stats */}
      <Card className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 font-medium text-indigo-600">
          <Users size={16} />
          Successful Referrals
        </div>

        <p className="text-3xl font-bold">{referralCount}</p>
      </Card>

      {/* Invite Link */}
      <Card className="space-y-4">
        <p className="text-xs text-zinc-500">
          Share your personal invite link
        </p>

        <div className="flex gap-2">
          <input
            readOnly
            value={inviteLink}
            className="input text-xs"
          />

          <Button size="sm" onClick={copyLink}>
            <Copy size={14} />
          </Button>
        </div>
      </Card>

      {/* Claim Code */}
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

          <Button size="sm" onClick={claimReferral} disabled={claiming}>
            Claim
          </Button>
        </div>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1 text-xs text-zinc-400">
        <CheckCircle size={12} />
        Automatic ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Secure ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Instant rewards
      </div>

    </div>
  )
}
