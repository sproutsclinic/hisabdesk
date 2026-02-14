// ==========================================================
// HisabDesk — Vault Download API
// ----------------------------------------------------------
// PURPOSE
//   Securely download a document from Supabase Storage
//
//   Flow:
//     validate user → fetch metadata → signed URL → redirect
//
//   SECURITY
//     ✓ user can ONLY access own files
//     ✓ signed URL (temporary)
//     ✓ server-side only
//
//   RULES
//     ✓ no AI
//     ✓ no public storage access
//     ✓ multi-tenant safe
//
//   Usage:
//     /api/vault/download?id=<document_id>
//
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// ==========================================================
// GET
// ==========================================================

export async function GET(req: Request) {
  try {
    const supabase = createClient()

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
    // Query param
    // ------------------------------------------------------

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "id required" },
        { status: 400 }
      )
    }

    // ------------------------------------------------------
    // Fetch document metadata
    // ------------------------------------------------------

    const { data: doc, error } = await supabase
      .from("documents")
      .select("path")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !doc) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    // ------------------------------------------------------
    // Create signed URL (60s)
    // ------------------------------------------------------

    const { data: signed, error: signError } =
      await supabase.storage
        .from("vault")
        .createSignedUrl(doc.path, 60)

    if (signError || !signed?.signedUrl) {
      throw signError
    }

    // ------------------------------------------------------
    // Redirect to file
    // ------------------------------------------------------

    return NextResponse.redirect(signed.signedUrl)
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
