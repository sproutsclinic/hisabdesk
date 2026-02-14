/* =========================================================
   HisabDesk — Automation Module (Personal)
   ---------------------------------------------------------
   UI ONLY PAGE

   PURPOSE
   - Manage recurring transactions
   - Salary / rent / SIP / EMI auto entries
   - Schedule rules
   - Call hooks only

   ARCHITECTURE
     UI → useAutomation → /api/automation → service → engine
     UI → useAutomationAI → /api/ai/automation/advice

   STRICT
   ❌ No business logic
   ❌ No DB
   ❌ No calculations
   ❌ No AI direct calls
   ❌ No cron logic

   ========================================================= */

"use client"

import { Card } from "@/components/ui/card"

import { useAutomation } from "@/hooks/useAutomation"

import AutomationSummaryCards from "./components/AutomationSummaryCards"
import AutomationForm from "./components/AutomationForm"
import AutomationTable from "./components/AutomationTable"

/* ✅ NEW (safe addition) */
import AutomationAIAdviceCard from "./components/AutomationAIAdviceCard"

/* =========================================================
   PAGE
   ========================================================= */

export default function AutomationPage() {
  const {
    overview,
    loading,
    error,
    create,
    remove,
  } = useAutomation()

  const rows = overview?.rules ?? []

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="space-y-6 p-6">
      {/* =====================================================
         HEADER
         ===================================================== */}
      <div>
        <h1 className="text-2xl font-semibold">Automation</h1>
        <p className="text-sm text-muted-foreground">
          Automatically create recurring income & expense
          transactions
        </p>
      </div>

      {/* =====================================================
         INFO CARD
         ===================================================== */}
      <Card className="p-4 text-sm text-muted-foreground">
        Add rules for salary, rent, SIPs, EMIs or subscriptions.
        HisabDesk will auto-create transactions on schedule.
      </Card>

      {/* =====================================================
         SUMMARY (monthly impact)
         ===================================================== */}
      {overview && (
        <AutomationSummaryCards overview={overview} />
      )}

      {/* =====================================================
         CREATE RULE FORM
         ===================================================== */}
      <AutomationForm
        loading={loading}
        onSubmit={create}
      />

      {/* =====================================================
         ERROR
         ===================================================== */}
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {/* =====================================================
         TABLE
         ===================================================== */}
      <AutomationTable
        rows={rows}
        onDelete={remove}
      />

      {/* =====================================================
         ✅ AI ADVISOR (NEW SAFE ADDITION)
         ===================================================== */}
      {rows.length > 0 && <AutomationAIAdviceCard />}
    </div>
  )
}
