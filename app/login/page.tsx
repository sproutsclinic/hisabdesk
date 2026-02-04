"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)

  // ======================
  // SEND OTP
  // ======================
  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("OTP sent to your email")
    setSent(true)
  }

  // ======================
  // VERIFY OTP
  // ======================
  const verifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    })

    if (error) {
      alert(error.message)
      return
    }

    // ✅ PROPER NEXT.JS REDIRECT
    router.replace("/dashboard")
  }

  return (
    <div className="p-10 space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">HisabDesk Login</h1>

      <input
        type="email"
        className="border p-2 w-full"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      {!sent ? (
        <button
          onClick={sendOtp}
          className="bg-blue-600 text-white p-2 w-full cursor-pointer"
        >
          Send OTP
        </button>
      ) : (
        <>
          <input
            className="border p-2 w-full"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white p-2 w-full cursor-pointer"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  )
}
