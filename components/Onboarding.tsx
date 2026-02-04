"use client"

import { useRouter } from "next/navigation"
import { completeOnboarding } from "@/lib/onboarding"

export default function Onboarding() {
  const router = useRouter()

  const finish = () => {
    completeOnboarding()
    router.push("/income/add")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">

        <h2 className="text-2xl font-bold">
          Welcome to HisabDesk 👋
        </h2>

        <p className="text-gray-600 text-sm">
          Let’s set up your tax dashboard in 30 seconds.
        </p>

        <ul className="text-left text-sm space-y-2">
          <li>✅ Add your income</li>
          <li>✅ Add your expenses</li>
          <li>✅ See your tax instantly</li>
        </ul>

        <button
          onClick={finish}
          className="bg-black text-white w-full py-3 rounded-xl"
        >
          Start Setup →
        </button>
      </div>

    </div>
  )
}
