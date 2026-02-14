/* =========================================================
   HisabDesk — Tax Service (Server Only)
   ---------------------------------------------------------
   RESPONSIBILITY:
   - Supabase DB access
   - Calls calc engine
   - Persists calculations
   - NO business math here
   - NO client imports

   Layer:
     API Route  →  Service  →  CalcEngine

   Safe for:
     app/api/tax/*
     app/api/ai/tax/*

   NEVER import inside client components
   ========================================================= */

import { createClient } from "@supabase/supabase-js"

import { calculateTax } from "./calcEngine"
import type {
  TaxProfileInput,
  TaxComputationResult,
  TaxProfileRow,
  TaxCalculationRow,
} from "./types"

/* =========================================================
   INTERNAL
   ========================================================= */

function getAdminClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server only
  )
}

function nowISO() {
  return new Date().toISOString()
}

/* =========================================================
   PROFILE
   ========================================================= */

export async function upsertTaxProfile(
  userId: string,
  age: number,
  filingStatus: TaxProfileRow["filing_status"],
) {
  const supabase = getAdminClient()

  const payload: Partial<TaxProfileRow> = {
    user_id: userId,
    age,
    filing_status: filingStatus,
    updated_at: nowISO(),
  }

  const { error } = await supabase
    .from("tax_profiles")
    .upsert(payload, { onConflict: "user_id" })

  if (error) throw error
}

export async function getTaxProfile(userId: string) {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from("tax_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error && error.code !== "PGRST116") throw error

  return (data as TaxProfileRow | null) ?? null
}

/* =========================================================
   CALCULATION + SAVE
   ========================================================= */

export async function calculateAndSaveTax(
  userId: string,
  financialYear: string,
  input: TaxProfileInput,
): Promise<TaxComputationResult> {
  const supabase = getAdminClient()

  /* ---------- 1. compute ---------- */
  const result = calculateTax(input)

  /* ---------- 2. persist ---------- */
  const row: Partial<TaxCalculationRow> = {
    user_id: userId,
    financial_year: financialYear,

    income: input.income,
    deductions: input.deductions,

    result,
    recommended_regime: result.recommended,
    total_tax:
      result.recommended === "old"
        ? result.oldRegime.totalTax
        : result.newRegime.totalTax,

    created_at: nowISO(),
  }

  const { error } = await supabase.from("tax_calculations").insert(row)

  if (error) throw error

  /* ---------- 3. ensure profile exists ---------- */
  await upsertTaxProfile(userId, input.age, input.filingStatus)

  return result
}

/* =========================================================
   HISTORY
   ========================================================= */

export async function getTaxHistory(userId: string) {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from("tax_calculations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data as TaxCalculationRow[]) ?? []
}

export async function getLatestTaxCalculation(
  userId: string,
  financialYear: string,
) {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from("tax_calculations")
    .select("*")
    .eq("user_id", userId)
    .eq("financial_year", financialYear)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return (data as TaxCalculationRow | null) ?? null
}

/* =========================================================
   DELETE (optional admin/cleanup)
   ========================================================= */

export async function deleteTaxCalculation(
  userId: string,
  calculationId: string,
) {
  const supabase = getAdminClient()

  const { error } = await supabase
    .from("tax_calculations")
    .delete()
    .eq("user_id", userId)
    .eq("id", calculationId)

  if (error) throw error
}
