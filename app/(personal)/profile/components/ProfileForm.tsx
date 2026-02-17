ï»¿"use client"

import type { ProfileRow, UpdateProfileRequest } from "@/lib/api/profile/types"

import ProfileRiskCard from "./ProfileRiskCard"
import ProfileGoalsCard from "./ProfileGoalsCard"
import ProfileDependentsCard from "./ProfileDependentsCard"
import ProfilePreferencesCard from "./ProfilePreferencesCard"
import ProfileSecurityCard from "./ProfileSecurityCard"

interface Props {
  profile: ProfileRow
  loading?: boolean
  onSave: (payload: UpdateProfileRequest) => void
}

export default function ProfileForm({ profile, loading, onSave }: Props) {
  return (
    <div className="space-y-6">
      <ProfileRiskCard profile={profile} onSave={onSave} />
      <ProfileGoalsCard profile={profile} onSave={onSave} />
      <ProfileDependentsCard profile={profile} onSave={onSave} />
      <ProfilePreferencesCard profile={profile} onSave={onSave} />
      <ProfileSecurityCard />

      {loading && (
        <div className="text-sm text-muted-foreground">SavingÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦</div>
      )}
    </div>
  )
}
