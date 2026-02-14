"use client"

// ==========================================================
// HisabDesk — Smart Financial Onboarding (PRO VERSION)
// MINIMUM QUESTIONS • MAXIMUM INTELLIGENCE
// BEFORE DASHBOARD
// AI-READY PROFILE
// ==========================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DEMO_USER = "00000000-0000-0000-0000-000000000000"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ==========================================================
  // SMART PROFILE MODEL (compact but powerful)
  // ==========================================================

  const [form, setForm] = useState({
    name: "",
    employment_type: "", // permanent / contract
    profession_type: "", // salaried / business / freelance
    annual_income: "",
    marital_status: "",
    dependents: "0",
    tax_preference: "", // save tax / invest / track only
    risk: "", // low medium high
  })

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !form.name ||
      !form.profession_type ||
      !form.annual_income ||
      !form.employment_type
    ) {
      setError("Please fill required fields")
      return
    }

    try {
      setLoading(true)
      setError(null)

      await supabase.from("profiles").upsert({
        id: DEMO_USER,
        full_name: form.name,
        metadata: form,
        onboarding_completed: true,
      })

      router.push("/dashboard")
    } catch {
      setError("Failed to save")
    } finally {
      setLoading(false)
    }
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl border shadow-sm p-8 space-y-5"
      >
        <h1 className="text-xl font-semibold">
          Let’s personalize your finance manager
        </h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* 1 Name */}
        <Input
          label="Your Name *"
          value={form.name}
          onChange={(v) => update("name", v)}
        />

        {/* 2 Profession */}
        <Select
          label="Type of Income *"
          value={form.profession_type}
          onChange={(v) => update("profession_type", v)}
          options={[
            "Salaried",
            "Business Owner",
            "Freelancer / Consultant",
            "Professional (Doctor/CA/Lawyer)",
            "Student",
            "Other",
          ]}
        />

        {/* 3 Employment type (IMPORTANT for tax) */}
        <Select
          label="Employment Type *"
          value={form.employment_type}
          onChange={(v) => update("employment_type", v)}
          options={[
            "Permanent",
            "Contract / Temporary",
            "Self-employed",
          ]}
        />

        {/* 4 Income */}
        <Input
          label="Annual Income ₹ *"
          type="number"
          value={form.annual_income}
          onChange={(v) => update("annual_income", v)}
        />

        {/* 5 Marital */}
        <Select
          label="Marital Status"
          value={form.marital_status}
          onChange={(v) => update("marital_status", v)}
          options={["Single", "Married"]}
        />

        {/* 6 Dependents */}
        <Select
          label="Dependents (kids/parents)"
          value={form.dependents}
          onChange={(v) => update("dependents", v)}
          options={["0", "1", "2", "3+"]}
        />

        {/* 7 Goal */}
        <Select
          label="Primary Goal"
          value={form.tax_preference}
          onChange={(v) => update("tax_preference", v)}
          options={[
            "Save Tax",
            "Invest & Grow Wealth",
            "Track Spending Only",
            "Plan Retirement",
          ]}
        />

        {/* 8 Risk */}
        <Select
          label="Risk Appetite"
          value={form.risk}
          onChange={(v) => update("risk", v)}
          options={["Low", "Medium", "High"]}
        />

        {/* Disclaimer */}
        <p className="text-xs text-gray-500">
          🔒 Your data is encrypted and used only by AI to provide smarter tax,
          saving and investment suggestions. Never shared with third parties.
        </p>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </main>
  )
}

/* ==========================================================
   SMALL COMPONENTS
========================================================== */

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 text-sm"
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 text-sm"
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
