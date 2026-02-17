ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  const rows = data ?? []

  const header = "Date,Category,Notes,Amount\n"

  const csv =
    header +
    rows
      .map(
        (r: any) =>
          `${r.date},"${r.category}","${r.notes}",${r.amount}`
      )
      .join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=expenses.csv",
    },
  })
}
