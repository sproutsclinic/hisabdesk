/* =========================================================
   HisabDesk — Portfolio Validators
   ---------------------------------------------------------
   SERVER SIDE SANITIZATION LAYER

   PURPOSE
   - Validate + sanitize all portfolio inputs
   - Prevent negative / invalid values
   - Central place for rules
   - Keep routes thin

   ARCHITECTURE
     route
       ↓
     validators (THIS FILE)
       ↓
     service
       ↓
     engine

   RULES
   ✅ validation only
   ✅ no DB
   ✅ no math logic
   ❌ no side effects

   ========================================================= */

import type {
  CreateAssetRequest,
  UpdateAssetRequest,
  AssetType,
} from "./types"

/* =========================================================
   CONSTANTS
   ========================================================= */

const ALLOWED_TYPES: AssetType[] = [
  "stock",
  "mutual_fund",
  "etf",
  "crypto",
  "gold",
  "real_estate",
  "fd",
  "bond",
  "cash",
  "other",
]



/* =========================================================
   HELPERS
   ========================================================= */

function clampNumber(n: unknown): number {
  return Math.max(0, Number(n ?? 0))
}

function cleanString(s: unknown): string {
  return String(s ?? "").trim()
}

function validateType(type: unknown): AssetType {
  if (ALLOWED_TYPES.includes(type as AssetType)) {
    return type as AssetType
  }

  return "other"
}



/* =========================================================
   CREATE SANITIZER
   ========================================================= */

export function sanitizeCreateAssetInput(
  payload: CreateAssetRequest,
): CreateAssetRequest {
  return {
    name: cleanString(payload.name),

    type: validateType(payload.type),

    quantity: clampNumber(payload.quantity),
    buy_price: clampNumber(payload.buy_price),
    current_price: clampNumber(payload.current_price),
  }
}



/* =========================================================
   UPDATE SANITIZER
   ========================================================= */

export function sanitizeUpdateAssetInput(
  payload: UpdateAssetRequest,
): UpdateAssetRequest {
  const sanitized: UpdateAssetRequest = {
    id: cleanString(payload.id),
  }

  if (payload.name !== undefined)
    sanitized.name = cleanString(payload.name)

  if (payload.type !== undefined)
    sanitized.type = validateType(payload.type)

  if (payload.quantity !== undefined)
    sanitized.quantity = clampNumber(payload.quantity)

  if (payload.buy_price !== undefined)
    sanitized.buy_price = clampNumber(payload.buy_price)

  if (payload.current_price !== undefined)
    sanitized.current_price = clampNumber(payload.current_price)

  return sanitized
}
