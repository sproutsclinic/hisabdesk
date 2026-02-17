ï»¿/* =========================================================
   Vault Service
   SERVER ONLY
   ========================================================= */

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import type { VaultFileRow } from "./types"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const BUCKET = "vault"

/* ========================================================= */

export async function listFiles(userId: string) {
  const { data } = await supabase
    .from("vault_files")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return data as VaultFileRow[]
}

/* ========================================================= */

export async function createFileMeta(
  row: Omit<VaultFileRow, "id" | "created_at">,
) {
  const { data } = await supabase
    .from("vault_files")
    .insert(row)
    .select()
    .single()

  return data
}

/* ========================================================= */

export async function deleteFile(userId: string, id: string) {
  const { data } = await supabase
    .from("vault_files")
    .select("file_path")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (!data) return

  await supabase.storage.from(BUCKET).remove([data.file_path])

  await supabase.from("vault_files").delete().eq("id", id)
}

/* ========================================================= */

export async function getSignedUrl(path: string) {
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60)

  return data?.signedUrl
}
