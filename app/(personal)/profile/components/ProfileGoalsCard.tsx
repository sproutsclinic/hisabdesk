ï»¿"use client"

import { Card } from "@/components/ui/card"
import type { ProfileRow, UpdateProfileRequest } from "@/lib/api/profile/types"

interface Props {
  profile: ProfileRow
  onSave: (payload: UpdateProfileRequest) => void
}

export default function ProfileGoalsCard({ profile, onSave }: Props) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Financial Goals</h2>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Annual Income Target"
          value={profile.income_goal ?? 0}
          onChange={(e) =>
            onSave({ income_goal: Number(e.target.value) })
          }
          className="border rounded p-2"
        />

        <input
          type="number"
          placeholder="Savings Target"
          value={profile.savings_goal ?? 0}
          onChange={(e) =>
            onSave({ savings_goal: Number(e.target.value) })
          }
          className="border rounded p-2"
        />
      </div>
    </Card>
  )
}
