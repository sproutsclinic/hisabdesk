import { NextResponse } from "next/server"
import JSZip from "jszip"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   VAULT BACKUP EXPORT API — FINAL (PRO LOCKED)

   🔒 Security layers:
   ✅ auth token required
   ✅ server-side Supabase service role
   ✅ verifies user
   ✅ verifies PRO
   ✅ only user files
   ✅ folderized zip
   ✅ production safe (Vercel)

   GET /api/vault/export
================================================= */

export async function GET(req: Request) {
  try {
    /* ================= AUTH ================= */

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
      }
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (!user || error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* ================= 🔒 PRO CHECK (HARD SERVER LOCK) ================= */

    const { data: profile, error: proErr } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .single()

    if (proErr || !profile?.is_pro) {
      return NextResponse.json(
        { error: "Pro plan required" },
        { status: 403 }
      )
    }

    /* ================= FETCH USER FILES ================= */

    const { data: items, error: itemsErr } = await supabase
      .from("vault_items")
      .select("title, category, file_url")
      .eq("user_id", user.id)
      .not("file_url", "is", null)

    if (itemsErr || !items || items.length === 0) {
      return NextResponse.json(
        { error: "No files found" },
        { status: 404 }
      )
    }

    /* ================= CREATE ZIP ================= */

    const zip = new JSZip()

    for (const item of items) {
      if (!item.file_url) continue

      const { data: file } = await supabase.storage
        .from("vault-documents")
        .download(item.file_url)

      if (!file) continue

      const buffer = await file.arrayBuffer()

      const originalName =
        item.file_url.split("/").pop() || `${item.title}.file`

      const safeTitle = (item.title || "document").replace(
        /[^a-z0-9.-]/gi,
        "_"
      )

      zip.file(`${item.category}/${safeTitle}_${originalName}`, buffer)
    }

    const content = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    })

    /* ================= RESPONSE ================= */

    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="hisabdesk-family-vault-backup.zip"',
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
