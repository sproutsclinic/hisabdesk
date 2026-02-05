"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

/* =================================================
   SIGNUP PAGE — Referral Aware

   Purpose:
   ✅ signup new user
   ✅ capture ?ref=CODE automatically
   ✅ store profiles.referred_by
   ✅ later used by /api/referrals/claim
   ✅ zero breaking

   Flow:
   /signup?ref=ABC123
        ↓
   save → profiles.referred_by = ABC123
================================================= */

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  const referralCode = searchParams.get("ref")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  /* ================= SIGNUP ================= */

  const signup = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      const user = data.user
      if (!user) return

      /* ================= CREATE PROFILE ================= */

      await supabase.from("profiles").upsert({
        id: user.id,
        referred_by: referralCode || null, // 🔥 referral saved here
      })

      toast.success("Account created successfully")

      router.replace("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-md mx-auto py-16">

      <Card className="space-y-6 p-6">

        <h1 className="text-lg font-semibold text-center">
          Create Account
        </h1>

        {/* referral banner */}
        {referralCode && (
          <div className="text-xs bg-green-50 text-green-700 p-2 rounded text-center">
            🎁 You were invited • Bonus will unlock after upgrade
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <Button
          onClick={signup}
          loading={loading}
          className="w-full"
        >
          Create Account
        </Button>

        <p className="text-xs text-zinc-400 text-center">
          Already have an account? Login instead
        </p>

      </Card>
    </div>
  )
}
