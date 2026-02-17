ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Vault Upload API
// ----------------------------------------------------------
// PURPOSE
//   Upload documents to Supabase Storage + save metadata
//
//   Flow:
//     file ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ storage bucket ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ documents table
//
//   Storage:
//     bucket: "vault"
//
//   DB table:
//     documents
//       id
//       user_id
//       name
//       category
//       size
//       path
//       created_at
//
//   RULES
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ server-side only
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ secure (auth required)
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ no AI
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ small/simple
//
// ==========================================================

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

// ==========================================================
// POST
// ==========================================================

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin()

    // ------------------------------------------------------
    // Auth
    // ------------------------------------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // ------------------------------------------------------
    // Form data
    // ------------------------------------------------------

    const form = await req.formData()

    const file = form.get("file") as File | null
    const category =
      (form.get("category") as string) || "other"

    if (!file) {
      return NextResponse.json(
        { error: "File required" },
        { status: 400 }
      )
    }

    // ------------------------------------------------------
    // Build path
    // ------------------------------------------------------

    const buffer = Buffer.from(await file.arrayBuffer())

    const filename = file.name.replace(/\s+/g, "_")

    const path = `${user.id}/${Date.now()}-${filename}`

    // ------------------------------------------------------
    // Upload to storage
    // ------------------------------------------------------

    const { error: uploadError } = await supabase.storage
      .from("vault")
      .upload(path, buffer, {
        contentType: file.type,
      })

    if (uploadError) throw uploadError

    // ------------------------------------------------------
    // Save metadata
    // ------------------------------------------------------

    await supabase.from("documents").insert({
      user_id: user.id,
      name: filename,
      category,
      size: file.size,
      path,
      created_at: new Date().toISOString(),
    })

    // ------------------------------------------------------
    // Redirect back
    // ------------------------------------------------------

    return NextResponse.redirect(
      new URL("/vault", req.url)
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
