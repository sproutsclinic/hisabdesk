"use client"

// ==========================================================
// HisabDesk — Onboarding Wizard (Professional Version)
// Location: app/(personal)/onboarding/page.tsx
//
// PURPOSE
// First-time setup for personal users
//
// ARCHITECTURE (STRICT)
// ✅ UI only
// ✅ calls API
// ❌ no business logic
// ❌ no calculations
// ❌ no Supabase
// ❌ no AI
//
// Flow:
// submit → /api/profile/onboarding → DB → dashboard
// ==========================================================

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Risk = "low" | "medium" | "high"

export default function OnboardingPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    risk: "medium" as Risk,
    dependents: "0",
    monthlyIncome: "0-25k",
    monthlyExpense: "0-10k",
    primaryGoal: "wealth",
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to save profile")
      }

      router.push("/personal/dashboard")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-2xl p-8 rounded-2xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Welcome to HisabDesk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer a few quick questions so we can personalise your dashboard.
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          {/* Risk */}
          <div className="space-y-2">
            <Label>Risk Appetite</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={form.risk}
              onChange={(e) => update("risk", e.target.value as Risk)}
            >
              <option value="low">Low (Safe & Stable)</option>
              <option value="medium">Medium (Balanced Growth)</option>
              <option value="high">High (Aggressive Returns)</option>
            </select>
          </div>

          {/* Dependents */}
          <div className="space-y-2">
            <Label>Dependents</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={form.dependents}
              onChange={(e) => update("dependents", e.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4+">4 or more</option>
            </select>
          </div>

          {/* Income */}
          <div className="space-y-2">
            <Label>Monthly Income</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={form.monthlyIncome}
              onChange={(e) => update("monthlyIncome", e.target.value)}
            >
              <option value="0-25k">₹0 – ₹25k</option>
              <option value="25-50k">₹25k – ₹50k</option>
              <option value="50-1L">₹50k – ₹1L</option>
              <option value="1-2L">₹1L – ₹2L</option>
              <option value="2L+">₹2L+</option>
            </select>
          </div>

          {/* Expense */}
          <div className="space-y-2">
            <Label>Monthly Expenses</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={form.monthlyExpense}
              onChange={(e) => update("monthlyExpense", e.target.value)}
            >
              <option value="0-10k">₹0 – ₹10k</option>
              <option value="10-25k">₹10k – ₹25k</option>
              <option value="25-50k">₹25k – ₹50k</option>
              <option value="50k+">₹50k+</option>
            </select>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label>Primary Goal</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={form.primaryGoal}
              onChange={(e) => update("primaryGoal", e.target.value)}
            >
              <option value="wealth">Wealth Growth</option>
              <option value="retirement">Retirement Planning</option>
              <option value="tax">Tax Saving</option>
              <option value="debt">Debt Free</option>
              <option value="family">Family Security</option>
            </select>
          </div>

        </div>

        <Button
          className="w-full"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Finish Setup"}
        </Button>

      </Card>
    </div>
  )
}
