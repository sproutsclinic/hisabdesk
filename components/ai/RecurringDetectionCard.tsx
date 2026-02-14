"use client"

/* =========================================================
   HisabDesk — Recurring Detection Card (SAFE STUB)
   ---------------------------------------------------------
   PURPOSE
   ✓ fixes missing module crash
   ✓ keeps existing layout intact
   ✓ API-only architecture respected
   ✓ no new logic added

   NOTE
   This is only a lightweight placeholder UI.
========================================================= */

import { Card } from "@/components/ui/card"

export default function RecurringDetectionCard() {
  return (
    <Card className="p-4 text-sm bg-muted/40">
      <p className="font-medium">Recurring Detection</p>
      <p className="text-muted-foreground text-xs mt-1">
        No recurring expenses detected
      </p>
    </Card>
  )
}