ï»¿export function welcomeEmailTemplate(name: string) {
  return `
  <div style="font-family:Arial,sans-serif;padding:24px;background:#f6f8fb">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:32px">
      <h2 style="margin:0 0 16px 0;color:#111">Welcome to HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬</h2>
      <p style="font-size:15px;color:#333">
        Hi ${name},
      </p>
      <p style="font-size:15px;color:#333">
        Your AI-powered tax & accounting workspace is ready.
        Track income, calculate taxes, and file smarter ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â all in one place.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
        style="display:inline-block;margin-top:20px;padding:12px 20px;background:#111;color:#fff;border-radius:8px;text-decoration:none">
        Open Dashboard
      </a>
      <p style="margin-top:32px;font-size:12px;color:#777">
        ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© ${new Date().getFullYear()} HisabDesk
      </p>
    </div>
  </div>
  `
}

export function paymentSuccessTemplate(amount: number) {
  return `
  <div style="font-family:Arial,sans-serif;padding:24px;background:#f6f8fb">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:32px">
      <h2 style="color:#16a34a;margin-bottom:16px">Payment Successful ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦</h2>
      <p>Your Pro subscription payment of <b>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${amount}</b> was successful.</p>
      <p>You now have access to all premium features.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
        style="display:inline-block;margin-top:20px;padding:12px 20px;background:#111;color:#fff;border-radius:8px;text-decoration:none">
        Continue to App
      </a>
    </div>
  </div>
  `
}

export function renewalReminderTemplate(daysLeft: number) {
  return `
  <div style="font-family:Arial,sans-serif;padding:24px;background:#f6f8fb">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:32px">
      <h2 style="margin-bottom:16px">Subscription Renewal Reminder ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³</h2>
      <p>Your Pro plan renews in <b>${daysLeft} days</b>.</p>
      <p>Please ensure your payment method is active to avoid interruption.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing"
        style="display:inline-block;margin-top:20px;padding:12px 20px;background:#111;color:#fff;border-radius:8px;text-decoration:none">
        Manage Billing
      </a>
    </div>
  </div>
  `
}
