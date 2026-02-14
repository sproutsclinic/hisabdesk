"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FirstTimeGuide() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("hisabdesk_first_time_modal")
    if (!seen) {
      setOpen(true)
      localStorage.setItem("hisabdesk_first_time_modal", "1")
    }
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-2">
          Welcome to HisabDesk 👋
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Track income, manage expenses, and calculate taxes automatically.
          Let’s set up your workspace in 2 minutes.
        </p>

        <ul className="text-sm space-y-2 mb-6">
          <li>✅ Add your first income</li>
          <li>✅ Track expenses</li>
          <li>✅ Check tax calculation</li>
          <li>✅ Upgrade to Pro for reports</li>
        </ul>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setOpen(false)
              router.push("/dashboard")
            }}
            className="flex-1 bg-black text-white rounded-xl py-2 text-sm"
          >
            Start Setup
          </button>

          <button
            onClick={() => setOpen(false)}
            className="flex-1 border rounded-xl py-2 text-sm"
          >
            Skip
          </button>
        </
