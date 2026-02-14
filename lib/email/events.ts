import { triggerEmail } from "./client"

/*
  Central reusable helpers
  Call these anywhere in app (auth, payments, cron, etc.)
  Keeps email logic clean & consistent
*/

export async function sendWelcomeEmail(to: string, name?: string) {
  await triggerEmail({
    type: "welcome",
    to,
    name,
  })
}

export async function sendPaymentSuccessEmail(to: string, amount: number) {
  await triggerEmail({
    type: "payment_success",
    to,
    amount,
  })
}

export async function sendRenewalReminderEmail(to: string, daysLeft: number) {
  await triggerEmail({
    type: "renewal",
    to,
    daysLeft,
  })
}
