ï»¿"use client"

import { Card } from "@/components/ui/card"
import type { ProfileRow, UpdateProfileRequest } from "@/lib/api/profile/types"

interface Props {
  profile: ProfileRow
  onSave: (payload: UpdateProfileRequest) => void
}

export default function ProfileRiskCard({ profile, onSave }: Props) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="font-medium">Risk Appetite</h2>

      <select
        value={profile.risk_appetite}
        onChange={(e) =>
          onSave({ risk_appetite: e.target.value as any })
        }
        className="border rounded p-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </Card>
  )
}
