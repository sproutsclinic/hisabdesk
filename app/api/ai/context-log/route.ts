ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

const supabase = getSupabaseAdmin()

interface Body {
  summary: string
  numbers?: Record<string, number | string>
}

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")
  return user
}

export async function POST(req: Request) {
  try {
    const user = await getUser()
    const body = (await req.json()) as Body

    await supabase.from("ai_context").insert({
      user_id: user.id,
      summary: body.summary,
      numbers: body.numbers || {},
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}

export async function GET() {
  try {
    const user = await getUser()

    const { data } = await supabase
      .from("ai_context")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      context: data || null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }
}
