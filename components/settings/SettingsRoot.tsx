"use client"

import SettingsPage from "./SettingsPage"
import ActivityHistory from "./ActivityHistory"
import SettingsNav from "./SettingsNav"

/*
  PHASE 18 — Enhanced Settings (Tabbed version)

  OPTIONAL upgrade
  Does NOT modify existing SettingsRoot

  Use this instead if you want tabs:
  import SettingsTabsRoot
*/

export default function SettingsTabsRoot() {
  return (
    <SettingsNav
      backup={<SettingsPage />}
      activity={<ActivityHistory />}
    />
  )
}
