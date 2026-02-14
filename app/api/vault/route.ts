/* =========================================================
   Vault API Route
   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import {
  listFiles,
  createFileMeta,
  deleteFile,
} from "@/lib/api/vault/service"

/* ========================================================= */

function getClient(req: NextRequest) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    },
  )
}

/* ========================================================= */

export async function GET(req: NextRequest) {
  const supabase = getClient(req)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const files = await listFiles(user.id)

  return NextResponse.json({
    data: {
      files,
      summary: {
        totalFiles: files.length,
        totalSize: files.reduce((a, b) => a + b.size, 0),
      },
    },
  })
}

/* ========================================================= */

export async function DELETE(req: NextRequest) {
  const supabase = getClient(req)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const id = new URL(req.url).searchParams.get("id")

  if (!user || !id) return NextResponse.json({ error: "Invalid" })

  await deleteFile(user.id, id)

  return NextResponse.json({ success: true })
}
