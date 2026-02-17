ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { getPortfolioOverview } from "@/lib/api/portfolio/service"

export const dynamic = "force-dynamic"

export async function GET() {
const supabase = getSupabaseAdmin()

const {
data: { user },
} = await supabase.auth.getUser()

if (!user) {
return NextResponse.json({}, { status: 401 })
}

// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Service handles DB + engine (no logic here)
const overview = await getPortfolioOverview(user.id)

return NextResponse.json({
invested: overview.summary.totalInvested,
current: overview.summary.totalCurrent,
gain: overview.summary.totalPnL,
})
}
