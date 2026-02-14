// ==========================================================
// HisabDesk — Vault Delete API
// ----------------------------------------------------------
// PURPOSE
//   Delete document safely from:
//     ✓ Supabase Storage
//     ✓ documents table
//
//   Flow:
//     validate user → get path → delete storage → delete row
//
//   SECURITY
//     ✓ user can delete ONLY own files
//     ✓ multi-tenant safe
//
//   RULES
//     ✓ server-side only
//     ✓ no AI
//     ✓ small + fast
//
//   Usage:
//     POST /api/vault/delete
//     body: { id }
//
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// ==========================================================
// TYPES
// ==========================================================

interface Body {
  id: string
}

// ==========================================================
// POST
// ==========================================================

export async function POST(req: Request) {
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
    // Body
    // ------------------------------------------------------

    const body = (await req.json()) as Body

    if (!body?.id) {
      return NextResponse.json(
        { error: "id required" },
        { status: 400 }
      )
    }

    // ------------------------------------------------------
    // Fetch document
    // ------------------------------------------------------

    const { data: doc, error } = await supabase
      .from("documents")
      .select("path")
      .eq("id", body.id)
      .eq("user_id", user.id)
      .single()

    if (error || !doc) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    // ------------------------------------------------------
    // Delete from storage
    // ------------------------------------------------------

    await supabase.storage
      .from("vault")
      .remove([doc.path])

    // ------------------------------------------------------
    // Delete metadata
    // ------------------------------------------------------

    await supabase
      .from("documents")
      .delete()
      .eq("id", body.id)
      .eq("user_id", user.id)

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
