ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Loans Service Layer
   ---------------------------------------------------------
   SERVER ONLY

   PURPOSE
   - DB access only
   - Calls engine for calculations
   - No business math here
   - No OpenAI
   - No route logic

   ARCHITECTURE
     route ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ service (THIS FILE) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ engine ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ types

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ DB queries only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ orchestration only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no math
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no AI
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no client logic

   ========================================================= */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import type {
  LoanRow,
  CreateLoanRequest,
  UpdateLoanRequest,
  LoanOverview,
} from "./types"

import {
  calculateEMI,
  buildLoanOverview,
} from "./engine"

/* =========================================================
   SERVER CLIENT (service role)
   ========================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/* =========================================================
   HELPERS
   ========================================================= */

function clamp(n: unknown) {
  return Math.max(0, Number(n ?? 0))
}

/* =========================================================
   FETCH
   ========================================================= */

export async function listLoans(
  userId: string,
): Promise<LoanRow[]> {
  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []) as LoanRow[]
}

export async function getLoansOverview(
  userId: string,
): Promise<LoanOverview> {
  const rows = await listLoans(userId)

  return buildLoanOverview(rows)
}

/* =========================================================
   CREATE
   ========================================================= */

export async function createLoan(
  userId: string,
  payload: CreateLoanRequest,
) {
  const principal = clamp(payload.principal)
  const rate = clamp(payload.interest_rate)
  const tenure = clamp(payload.tenure_months)

  const emi = calculateEMI(principal, rate, tenure)

  const { data, error } = await supabase
    .from("loans")
    .insert([
      {
        user_id: userId,

        name: payload.name,
        type: payload.type,

        principal,
        interest_rate: rate,
        tenure_months: tenure,

        start_date:
          payload.start_date || new Date().toISOString(),

        emi,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return data
}

/* =========================================================
   UPDATE
   ========================================================= */

export async function updateLoan(
  userId: string,
  payload: UpdateLoanRequest,
) {
  const update: any = { ...payload }

  if (
    payload.principal ||
    payload.interest_rate ||
    payload.tenure_months
  ) {
    const emi = calculateEMI(
      clamp(payload.principal),
      clamp(payload.interest_rate),
      clamp(payload.tenure_months),
    )

    update.emi = emi
  }

  const { data, error } = await supabase
    .from("loans")
    .update(update)
    .eq("user_id", userId)
    .eq("id", payload.id)
    .select()
    .single()

  if (error) throw error

  return data
}

/* =========================================================
   DELETE
   ========================================================= */

export async function deleteLoan(
  userId: string,
  id: string,
) {
  const { error } = await supabase
    .from("loans")
    .delete()
    .eq("user_id", userId)
    .eq("id", id)

  if (error) throw error
}
