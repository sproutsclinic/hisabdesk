ï»¿"use client"

import { useProfile } from "@/hooks/useProfile"

import ProfileHeader from "./components/ProfileHeader"
import ProfileForm from "./components/ProfileForm"
import ProfileEmptyState from "./components/ProfileEmptyState"

/* =========================================================
   PAGE
   Thin orchestration only
   ========================================================= */

export default function ProfilePage() {
  const { profile, loading, error, update } = useProfile()

  if (!profile) return <ProfileEmptyState />

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader />

      <ProfileForm
        profile={profile}
        loading={loading}
        onSave={update}
      />

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
    </div>
  )
}
