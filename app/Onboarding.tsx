"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkeletonText } from "@/components/ui/skeleton"

/* ========================================
   QUESTIONS (Smart + skippable ready)
======================================== */

const questions = [
  {
    key: "employment",
    title: "How do you earn?",
    options: [
      "Salaried",
      "Freelancer / Consultant",
      "Doctor / Professional (44ADA)",
      "Business Owner",
    ],
  },
  {
    key: "income_range",
    title: "Your yearly income?",
    options: ["< ₹5L", "₹5–10L", "₹10–25L", "₹25L+"],
  },
  {
    key: "rented",
    title: "Do you live in rented house?",
    options: ["Yes", "No"],
  },
  {
    key: "loans",
    title: "Any loans?",
    options: ["Home loan", "Education loan", "None"],
  },
  {
    key: "dependents",
    title: "Dependents?",
    options: ["Parents", "Children", "Both", "None"],
  },
  {
    key: "investments",
    title: "Investments?",
    options: ["LIC/PPF/ELSS", "Stocks/Mutual Funds", "Both", "None"],
  },
]

/* ========================================
   PAGE — Conversational Wizard
   Adds:
   ✅ mobile first
   ✅ large tap targets
   ✅ card UI
   ✅ sticky progress
   ✅ auto save
   ✅ resume support
   ✅ skip/back buttons
   ✅ trust messaging
======================================== */

export default function Onboarding() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const total = questions.length

  /* ========================
     LOAD USER + RESUME
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

        const answeredCount = Object.keys(
          profile.onboarding_profile
        ).length

        setStep(answeredCount)
      }

      setLoading(false)
    }

    load()
  }, [router])

  /* ========================
     SAVE (UPSERT)
  ======================== */

  const saveAnswer = async (key: string, value: string) => {
    const updated = { ...answers, [key]: value }

    setAnswers(updated)

    await supabase.from("profiles").upsert({
      id: userId,
      onboarding_profile: updated,
    })
  }

  /* ========================
     NAVIGATION
  ======================== */

  const next = () => {
    if (step === total - 1) {
      router.push("/dashboard")
      return
    }
    setStep((s) => s + 1)
  }

  const back = () => {
    if (step === 0) return
    setStep((s) => s - 1)
  }

  const handleSelect = async (value: string) => {
    const q = questions[step]
    await saveAnswer(q.key, value)
    next()
  }

  const skip = () => next()

  /* ========================
     PROGRESS
  ======================== */

  const progress = useMemo(() => {
    return ((step + 1) / total) * 100
  }, [step, total])

  const current = questions[step]

  /* ========================
     LOADING
  ======================== */

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <SkeletonText lines={4} />
      </div>
    )
  }

  if (!current) return null

  /* ========================
     UI
  ======================== */

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* ===== Progress bar ===== */}
      <div className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b">
        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-1 bg-zinc-900 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">
              {current.title}
            </h2>

            <p className="text-xs text-zinc-500">
              Helps us optimise your tax automatically
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {current.options.map((opt) => (
              <Button
                key={opt}
                variant="outline"
                size="lg"
                className="w-full justify-center"
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={back}
              disabled={step === 0}
            >
              Back
            </Button>

            <Button variant="ghost" size="sm" onClick={skip}>
              Skip
            </Button>
          </div>

          {/* Step text */}
          <p className="text-xs text-center text-zinc-500">
            Step {step + 1} of {total}
          </p>

          {/* Trust note */}
          <p className="text-[11px] text-center text-zinc-400">
            🔒 Your answers stay private & encrypted
          </p>
        </Card>
      </div>
    </div>
  )
}
