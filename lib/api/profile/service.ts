ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Profile Service
   ---------------------------------------------------------
   SERVER SIDE SERVICE ONLY

   PURPOSE
   - DB access layer for Profile module
   - Called by API routes only
   - ZERO UI logic
   - ZERO AI
   - ZERO calculations

   ARCHITECTURE
     route ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ supabase
========================================================= */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import type {
  ProfileRow,
  ProfileOverview,
  UpdateProfileRequest,
} from "./types"

/* =========================================================
   SERVER CLIENT (service role only)
========================================================= */

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/* =========================================================
   DEFAULT PROFILE (must match DB schema exactly)
========================================================= */

function defaultProfile(userId: string): ProfileRow {
  const now = new Date().toISOString()

  return {
    user_id: userId,

    full_name: null,
    age: null,

    risk_appetite: "medium",
    income_stability: "salaried",

    monthly_income: 0,
    monthly_expense: 0,
    dependents: 0,

    financial_goal: null,

    income_goal: null,
    savings_goal: null,

    currency: "INR",
    locale: "en-IN",

    // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ REQUIRED FLAGS (these caused the error)
    notifications_enabled: true,
    ai_enabled: true,

    created_at: now,
    updated_at: now,
  }
}
/* =========================================================
   GET PROFILE
========================================================= */

export async function getProfileOverview(
  userId: string,
): Promise<ProfileOverview> {
  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  // If profile does not exist ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ create default
  if (error || !data) {
    const row = defaultProfile(userId)

    await supabase.from("profiles").insert(row)

    return { profile: row }
  }

  return { profile: data as ProfileRow }
}

/* =========================================================
   UPDATE PROFILE
========================================================= */

export async function updateProfile(
  userId: string,
  payload: UpdateProfileRequest,
): Promise<ProfileRow> {
  const supabase = getAdminClient()

  const updateData = {
    ...payload,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data as ProfileRow
}
