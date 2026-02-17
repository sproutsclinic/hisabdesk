ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { userId } = await req.json()

  await supabase
    .from("profiles")
    .update({ is_pro: true })
    .eq("id", userId)

  return NextResponse.json({ success: true })
}
