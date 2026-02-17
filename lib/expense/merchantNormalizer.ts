ï»¿/* =========================================================
   Merchant Normalizer
   Pure logic
   No DB
   ========================================================= */

const RULES: Record<string, RegExp[]> = {
  Amazon: [/amazon/i, /amzn/i],
  Swiggy: [/swiggy/i],
  Zomato: [/zomato/i],
  Netflix: [/netflix/i],
  Flipkart: [/flipkart/i],
  Uber: [/uber/i],
  Ola: [/ola/i],
  BigBasket: [/bigbasket/i],
  Rent: [/rent/i],
  Electricity: [/electric/i, /power/i],
  Water: [/water/i],
  Internet: [/wifi/i, /broadband/i, /jiofiber/i, /airtel/i],
}

export function normalizeMerchant(text?: string) {
  if (!text) return "Other"

  for (const [name, patterns] of Object.entries(RULES)) {
    for (const p of patterns) {
      if (p.test(text)) return name
    }
  }

  return "Other"
}
