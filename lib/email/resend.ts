import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export type EmailPayload = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: "HisabDesk <noreply@hisabdesk.com>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Email error:", error)
      throw error
    }

    return data
  } catch (err) {
    console.error("Resend failed:", err)
    throw err
  }
}
