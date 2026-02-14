/*
=========================================================
GST AUTH LAYER
Stores GST tokens securely in Supabase
=========================================================
*/

import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function saveGSTCredentials(
  orgId: string,
  gstin: string,
  tokenData: {
    access_token: string
    refresh_token: string
    expires_in: number
  }
) {
  await supabaseAdmin.from("gst_credentials").upsert({
    org_id: orgId,
    gstin,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: Date.now() + tokenData.expires_in * 1000,
  })
}
