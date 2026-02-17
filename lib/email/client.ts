ï»¿type EmailType = "welcome" | "payment_success" | "renewal"

type SendEmailOptions = {
  type: EmailType
  to: string
  name?: string
  amount?: number
  daysLeft?: number
}

export async function triggerEmail(options: SendEmailOptions) {
  try {
    await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })
  } catch (err) {
    console.error("Email trigger failed:", err)
  }
}
