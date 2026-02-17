ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Documents (Vault) API Layer
// Secure document metadata + Supabase Storage integration
// Used by: vault module, tax proofs, receipts, AI context
// Storage bucket assumed: "documents"
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export interface DocumentInput {
  file: File
  name?: string
  transaction_id?: string | null
  tags?: string[] | null
}

export interface DocumentMeta {
  id: string
  name: string
  path: string
  size: number
  mime_type: string
  transaction_id?: string | null
  tags?: string[] | null
}

// ==========================================================
// INTERNAL HELPERS
// ==========================================================

function buildPath(userId: string, filename: string) {
  const timestamp = Date.now()
  return `${userId}/${timestamp}-${filename}`
}

// ==========================================================
// UPLOAD
// ==========================================================

export async function uploadDocument(
  userId: string,
  input: DocumentInput
) {
  const file = input.file
  const path = buildPath(userId, file.name)

  // upload to storage
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) throw uploadError

  // save metadata
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      name: input.name ?? file.name,
      path,
      size: file.size,
      mime_type: file.type,
      transaction_id: input.transaction_id ?? null,
      tags: input.tags ?? null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// DELETE
// ==========================================================

export async function deleteDocument(
  id: string,
  userId: string
) {
  const doc = await getDocument(id, userId)

  // remove storage file
  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([doc.path])

  if (storageError) throw storageError

  // remove metadata
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getDocument(
  id: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// LIST
// ==========================================================

export async function listDocuments(userId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data || []
}

// ==========================================================
// GET SIGNED URL (secure download)
// ==========================================================

export async function getDocumentUrl(
  path: string,
  expiresIn = 60 * 5
) {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, expiresIn)

  if (error) throw error

  return data.signedUrl
}

// ==========================================================
// LINK TO TRANSACTION
// ==========================================================

export async function linkDocumentToTransaction(
  id: string,
  userId: string,
  transactionId: string
) {
  const { data, error } = await supabase
    .from("documents")
    .update({ transaction_id: transactionId })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}
