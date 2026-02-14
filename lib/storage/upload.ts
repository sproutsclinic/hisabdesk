// ==========================================================
// HisabDesk — Storage Upload Service (UNIVERSAL SAFE)
// Works in:
//   ✓ Client Components
//   ✓ Server Components
//   ✓ Next.js 16
//
// Phase 4 — Bill Automation Foundation
//
// Responsibilities:
//   • upload receipt/image/pdf
//   • return public URL
//   • delete files
//   • safe + minimal
// ==========================================================

import { createClient } from "@supabase/supabase-js"

/* ==========================================================
   SINGLETON STORAGE CLIENT
========================================================== */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
  }
)

/* ==========================================================
   CONFIG
========================================================== */

// create this bucket once in Supabase dashboard:
// name: receipts
// public: true

const BUCKET = "receipts"

/* ==========================================================
   HELPERS
========================================================== */

function sanitize(name: string) {
  return name.replace(/\s+/g, "-").toLowerCase()
}

function buildPath(userId: string, fileName: string) {
  const ts = Date.now()
  return `${userId}/${ts}-${sanitize(fileName)}`
}

/* ==========================================================
   UPLOAD FILE
   returns: { path, url }
========================================================== */

export async function uploadReceipt(
  userId: string,
  file: File | Blob,
  fileName: string
) {
  const path = buildPath(userId, fileName)

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return {
    path,
    url: data.publicUrl,
  }
}

/* ==========================================================
   DELETE FILE
========================================================== */

export async function deleteReceipt(path: string) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path])

  if (error) throw error

  return true
}

/* ==========================================================
   GET PUBLIC URL (if path already stored)
========================================================== */

export function getReceiptUrl(path: string) {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}
