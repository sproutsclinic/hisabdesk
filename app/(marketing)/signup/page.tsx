"use client"

// app/(marketing)/signup/page.tsx

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function SignupPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("personal")
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    try {
      setLoading(true)

      // create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const userId = data.user?.id
      if (!userId) return

      // save role in profiles table
      await supabase.from("profiles").insert({
        id: userId,
        role,
      })

      // go to payment/pricing step
      router.push("/pricing")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md border rounded-2xl p-8 bg-white">

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center">
          Get started with HisabDesk
        </h1>

        <p className="text-sm text-slate-600 text-center mt-2">
          Create your account in seconds
        </p>



        {/* =============================== */}
        {/* Auth Methods */}
        {/* =============================== */}
        <div className="mt-8 space-y-3">

          <button className="w-full border rounded-xl p-3 hover:bg-slate-50 font-medium">
            Continue with Google
          </button>

          <button className="w-full border rounded-xl p-3 hover:bg-slate-50 font-medium">
            Continue with Mobile OTP
          </button>

        </div>



        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t" />
          <span className="text-xs text-slate-500">or</span>
          <div className="flex-1 border-t" />
        </div>



        {/* Email Signup */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>



        {/* =============================== */}
        {/* Role Selection */}
        {/* =============================== */}
        <div className="mt-8">

          <p className="text-sm font-medium mb-3">
            I want to use HisabDesk for:
          </p>

          <div className="space-y-2 text-sm">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={role === "personal"}
                onChange={() => setRole("personal")}
              />
              Personal finances
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={role === "business"}
                onChange={() => setRole("business")}
              />
              My business (GST)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={role === "ca"}
                onChange={() => setRole("ca")}
              />
              CA / Firm workspace
            </label>

          </div>
        </div>



        {/* Create Account */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-8 bg-black text-white rounded-xl p-3 font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>



        {/* Footer */}
        <p className="text-sm text-center text-slate-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </p>

      </div>
    </div>
  )
}
