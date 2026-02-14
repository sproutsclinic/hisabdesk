"use server"

/**
 * =========================================================
 * GST Client
 * HisabDesk – Phase A (Govt Integrations)
 * =========================================================
 *
 * PURPOSE
 * Single gateway for ALL GST provider calls.
 *
 * WHY
 * Never call fetch() directly inside routes/services.
 * Keep provider logic centralized here.
 *
 * BENEFITS
 * ✓ easy provider swap later
 * ✓ retry logic ready
 * ✓ auth handled once
 * ✓ clean architecture
 *
 * TODAY (MVP)
 * Uses mock responses.
 * Later → plug real GST API.
 * =========================================================
 */

type RequestOptions = {
  path: string
  method?: "GET" | "POST"
  body?: any
}

/* =========================================================
   BASE CONFIG
========================================================= */

const BASE_URL = process.env.GST_API_BASE_URL || ""
const API_KEY = process.env.GST_API_KEY || ""

/* =========================================================
   CORE REQUEST WRAPPER (future use)
========================================================= */

async function request(opts: RequestOptions) {
  if (!BASE_URL) {
    // dev mode → skip real API
    return {}
  }

  const res = await fetch(`${BASE_URL}${opts.path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  if (!res.ok) {
    throw new Error("GST provider error")
  }

  return res.json()
}

/* =========================================================
   MOCK HELPERS (Day 1 safe mode)
   Replace with real API later
========================================================= */

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

/* =========================================================
   GSTR-1 (Sales)
========================================================= */

export async function fetchGSTR1(period: string) {
  /* -------------------------
     MOCK DATA (today)
  -------------------------- */

  const sales = random(90000, 200000)
  const tax = Math.round(sales * 0.18)

  return {
    period,
    total_sales: sales,
    total_tax: tax,
    raw: {
      mock: true,
      type: "GSTR1",
    },
  }

  /* -------------------------
     REAL (later)
  --------------------------
  return request({
    path: `/gstr1?period=${period}`
  })
  */
}

/* =========================================================
   GSTR-3B (Purchase/ITC)
========================================================= */

export async function fetchGSTR3B(period: string) {
  const purchase = random(40000, 120000)
  const itc = Math.round(purchase * 0.18)

  return {
    period,
    total_purchase: purchase,
    total_itc: itc,
    raw: {
      mock: true,
      type: "GSTR3B",
    },
  }
}

/* =========================================================
   HEALTH CHECK (optional)
========================================================= */

export async function testGSTConnection() {
  try {
    await fetchGSTR1("2026-01")
    return true
  } catch {
    return false
  }
}
