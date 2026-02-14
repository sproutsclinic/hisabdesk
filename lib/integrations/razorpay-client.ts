/**
 * =========================================================
 * Razorpay Client Wrapper (Enterprise API Layer)
 * HisabDesk – Phase A
 * =========================================================
 *
 * PURPOSE
 * Central Razorpay SDK replacement
 *
 * Instead of calling Razorpay directly everywhere,
 * ALL calls go through this file.
 *
 * Benefits:
 *   ✓ single source of truth
 *   ✓ secure keys (server only)
 *   ✓ reusable
 *   ✓ testable
 *   ✓ cleaner architecture
 *
 * SAFE
 * - server only
 * - no existing file changes
 *
 * ENV REQUIRED
 * RAZORPAY_KEY_ID
 * RAZORPAY_KEY_SECRET
 *
 * =========================================================
 */

"use server"

const KEY_ID = process.env.RAZORPAY_KEY_ID!
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

/* =========================================================
   INTERNAL FETCH
========================================================= */

async function razorpayFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!KEY_ID || !KEY_SECRET) {
    throw new Error("Missing Razorpay credentials")
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")

  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      ...(options.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Razorpay API Error: ${text}`)
  }

  return res.json()
}

/* =========================================================
   PAYMENTS
========================================================= */

export async function fetchPayment(paymentId: string) {
  return razorpayFetch(`/payments/${paymentId}`)
}

export async function capturePayment(
  paymentId: string,
  amount: number
) {
  return razorpayFetch(`/payments/${paymentId}/capture`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  })
}

export async function refundPayment(
  paymentId: string,
  amount?: number
) {
  return razorpayFetch(`/payments/${paymentId}/refund`, {
    method: "POST",
    body: JSON.stringify(amount ? { amount } : {}),
  })
}

/* =========================================================
   SUBSCRIPTIONS
========================================================= */

export async function fetchSubscription(subscriptionId: string) {
  return razorpayFetch(`/subscriptions/${subscriptionId}`)
}

export async function cancelSubscription(subscriptionId: string) {
  return razorpayFetch(`/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
  })
}

export async function pauseSubscription(subscriptionId: string) {
  return razorpayFetch(`/subscriptions/${subscriptionId}/pause`, {
    method: "POST",
  })
}

export async function resumeSubscription(subscriptionId: string) {
  return razorpayFetch(`/subscriptions/${subscriptionId}/resume`, {
    method: "POST",
  })
}

/* =========================================================
   INVOICES
========================================================= */

export async function fetchInvoice(invoiceId: string) {
  return razorpayFetch(`/invoices/${invoiceId}`)
}

export async function fetchAllInvoices(params?: {
  from?: number
  to?: number
  count?: number
  skip?: number
}) {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString()

  return razorpayFetch(`/invoices?${query}`)
}

/* =========================================================
   ORDERS
========================================================= */

export async function createOrder(data: {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}) {
  return razorpayFetch(`/orders`, {
    method: "POST",
    body: JSON.stringify({
      currency: "INR",
      ...data,
    }),
  })
}

/* =========================================================
   CUSTOMERS
========================================================= */

export async function createCustomer(data: {
  name: string
  email?: string
  contact?: string
}) {
  return razorpayFetch(`/customers`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function fetchCustomer(customerId: string) {
  return razorpayFetch(`/customers/${customerId}`)
}
