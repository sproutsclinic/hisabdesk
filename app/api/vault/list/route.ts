// ==========================================================
// HisabDesk — Vault List API
// ----------------------------------------------------------
// PURPOSE
//   Return current user's document metadata list
//
//   Used by:
//     ✓ Vault page (client hooks)
//     ✓ useVaultDocuments()
//     ✓ future AI tax document scanning
//
//   SECURITY
//     ✓ user sees ONLY own docs
//     ✓ multi-tenant safe
//
//   RULES
//     ✓ server-side only
//     ✓ NO storage calls
//     ✓ metadata only (fast)
//
//   Response:
//     VaultDocument[]
//
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// ==========================================================
// GET
// ==========================================================

export async function GET() {
  try {
    const supabase = createClient()

    // ------------------------------------------------------
    // Auth
    // ------------------------------------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json([], { status: 401 })
    }

    // ------------------------------------------------------
    // Fetch documents
    // ------------------------------------------------------

    const { data } = await supabase
      .from("documents")
      .select(
        "id,name,category,size,path,created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
