"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

/* ========================================
   QUESTIONS
======================================== */

const questions = [
  {
    key: "employment",
    title: "How do you earn?",
    options: [
      "Salaried",
      "Freelancer / Consultant",
      "Doctor / Professional (44ADA)",
      "Business Owner"
    ]
  },
  {
    key: "income_range",
    title: "Your yearly income?",
    options: ["< ₹5L", "₹5–10L", "₹10–25L", "₹25L+"]
  },
  {
    key: "rented",
    title: "Do you live in rented house?",
    options: ["Yes", "No"]
  },
  {
    key: "loans",
    title: "Any loans?",
    options: ["Home loan", "Education loan", "None"]
  },
  {
    key: "dependents",
    title: "Dependents?",
    options: ["Parents", "Children", "Both", "None"]
  },
  {
    key: "investments",
    title: "Investments?",
    options: ["LIC/PPF/ELSS", "Stocks/Mutual Funds", "Both", "None"]
  }
]

/* ========================================
   PAGE
======================================== */

export default function Onboarding() {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<any>({})

  const total = questions.length

  /* ========================
     Load user + resume
  ======================== */

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

      setUserId(data.user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_profile")
        .eq("id", data.user.id)
        .single()

      if (profile?.onboarding_profile) {
        setAnswers(profile.onboarding_profile)

        const answeredCount = Object.keys(profile.onboarding_profile).length
        setStep(answeredCount)
      }
    }

    load()
  }, [])

  /* ========================
     SAVE (UPSERT)
  ======================== */

  const saveAnswer = async (key: string, value: string) => {
    const updated = { ...answers, [key]: value }

    setAnswers(updated)

    await supabase.from("profiles").upsert({
      id: userId,
      onboarding_profile: updated
    })
  }

  /* ========================
     NEXT
  ======================== */

  const handleSelect = async (value: string) => {
    const q = questions[step]

    await saveAnswer(q.key, value)

    if (step === total - 1) {
      router.push("/dashboard")
      return
    }

    setStep(step + 1)
  }

  const current = questions[step]
  const progress = ((step + 1) / total) * 100

  if (!current) return null

  /* ========================
     UI
  ======================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">

      <div className="bg-white rounded-2xl shadow-sm border p-6 w-full max-w-md space-y-6">

        {/* Progress */}
        <div className="w-full bg-zinc-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-lg font-semibold text-center">
          {current.title}
        </h2>

        <div className="space-y-3">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="
                w-full border rounded-xl py-3 text-sm
                hover:bg-zinc-100 transition
              "
            >
              {opt}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-500 text-center">
          Step {step + 1} of {total}
        </p>
      </div>
    </div>
  )
}
