/* =========================================================
   HisabDesk — Vault Types
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
