"use client"

import { Card } from "@/components/ui/card"

export default function ProfileEmptyState() {
  return (
    <Card className="p-8 text-center text-sm text-muted-foreground">
      Profile not set up yet. Add your details to personalize
      insights and recommendations.
    </Card>
  )
}
