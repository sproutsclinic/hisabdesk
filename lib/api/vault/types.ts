ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Vault Types
   ========================================================= */

export type VaultCategory =
  | "identity"
  | "tax"
  | "bank"
  | "insurance"
  | "investment"
  | "loan"
  | "other"

export interface VaultFileRow {
  id: string
  user_id: string

  name: string
  category: VaultCategory

  file_path: string
  size: number
  mime: string

  created_at: string
}

/* ----------------------------- */

export interface CreateVaultFileRequest {
  name: string
  category: VaultCategory
}

/* ----------------------------- */

export interface VaultOverview {
  files: VaultFileRow[]

  summary: {
    totalFiles: number
    totalSize: number
  }
}
