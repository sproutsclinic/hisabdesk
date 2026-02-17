ï»¿"use client"

import { Card } from "@/components/ui/card"

export default function ProfileSecurityCard() {
  return (
    <Card className="p-6 space-y-2">
      <h2 className="font-medium">Security</h2>

      <p className="text-sm text-muted-foreground">
        Vault & personal documents are encrypted and private.
        More controls coming soon.
      </p>
    </Card>
  )
}
