"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)

  // STEP 1 — send OTP to email
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

  // STEP 2 — verify OTP
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

    alert("Login success")
    window.location.href = "/dashboard"

  }

  return (
    <div className="p-10 space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">HisabDesk Login</h1>

      {/* Email input */}
      <input
        type="email"
        className="border p-2 w-full"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      {!sent ? (
        <button
          type="button"                 // ✅ added
          onClick={sendOtp}
          className="bg-blue-600 text-white p-2 w-full cursor-pointer" // ✅ added cursor
        >
          Send OTP
        </button>
      ) : (
        <>
          {/* OTP input */}
          <input
            className="border p-2 w-full"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="button"               // ✅ added
            onClick={verifyOtp}
            className="bg-green-600 text-white p-2 w-full cursor-pointer" // ✅ added cursor
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  )
}
