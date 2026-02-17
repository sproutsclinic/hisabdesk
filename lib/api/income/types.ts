ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Income Types
   Domain only
   ========================================================= */

export interface IncomeRow {
  id: string
  user_id: string

  source_id: string | null
  category: string | null

  amount: number
  notes: string | null
  date: string

  created_at: string
}

export interface CreateIncomeRequest {
  amount: number
  category?: string
  notes?: string
  date: string
  source_id?: string | null
}

export interface UpdateIncomeRequest extends CreateIncomeRequest {
  id: string
}

export interface IncomeListResponse {
  rows: IncomeRow[]
  total: number
}
