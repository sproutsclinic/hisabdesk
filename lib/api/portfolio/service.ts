ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Portfolio Service (DB LAYER)
   ---------------------------------------------------------
   SERVER SIDE ONLY

   PURPOSE
   - Handles ALL database interaction for portfolio
   - Calls engine for computations
   - Thin orchestration only
   - No math logic here

   ARCHITECTURE
     route
       ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“
     service (THIS FILE)
       ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“
     engine (pure math)

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ DB calls allowed
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ calls engine
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no business math
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no OpenAI
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no client usage
   ========================================================= */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import type {
  AssetRow,
  CreateAssetRequest,
  UpdateAssetRequest,
  PortfolioOverview,
} from "./types"

import { computePortfolioOverview } from "./engine"

/* =========================================================
   SERVER CLIENT (service role only)
   ========================================================= */

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/* =========================================================
   TABLE
   ========================================================= */

const TABLE = "assets"

/* =========================================================
   CRUD
   ========================================================= */

export async function listAssets(
  userId: string,
): Promise<AssetRow[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []) as AssetRow[]
}

/* ---------------------------------------------------------
   COMPATIBILITY EXPORT
   Routes still call "listInvestments"
   --------------------------------------------------------- */

export async function listInvestments(
  userId: string,
): Promise<AssetRow[]> {
  return listAssets(userId)
}

export async function createAsset(
  userId: string,
  payload: CreateAssetRequest,
): Promise<AssetRow> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      ...payload,
    })
    .select()
    .single()

  if (error) throw error

  return data as AssetRow
}

export async function updateAsset(
  userId: string,
  payload: UpdateAssetRequest,
): Promise<AssetRow> {
  const supabase = getServiceClient()

  const { id, ...updates } = payload

  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data as AssetRow
}

export async function deleteAsset(
  userId: string,
  assetId: string,
): Promise<void> {
  const supabase = getServiceClient()

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", assetId)
    .eq("user_id", userId)

  if (error) throw error
}

/* =========================================================
   OVERVIEW (dashboard use)
   ========================================================= */

export async function getPortfolioOverview(
  userId: string,
): Promise<PortfolioOverview> {
  const rows = await listAssets(userId)

  /* engine handles all math */
  return computePortfolioOverview(rows)
}
