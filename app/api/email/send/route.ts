ï»¿// ==========================================================
// Email Send API
// Route: /api/email/send
//
// PURPOSE
// Sends transactional emails (welcome, payment, reminders)
//
// RULES
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Route handler only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO templates here
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO HTML here
// Templates live in lib/email/templates.ts
// ==========================================================

import { NextRequest, NextResponse } from "next/server"

// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ REQUIRED in Next.js 16 so validator understands this route
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// (Later we will connect Resend / SES here)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing email fields" },
        { status: 400 }
      )
    }

    // ------------------------------------------------------
    // TODO: Integrate email provider here (Resend / SES)
    // ------------------------------------------------------
    console.log("Sending email:", { to, subject })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Email send failed:", err)

    return NextResponse.json(
      { error: "Email failed" },
      { status: 500 }
    )
  }
}
