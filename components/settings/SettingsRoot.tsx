ï»¿"use client"

import SettingsPage from "./SettingsPage"
import ActivityHistory from "./ActivityHistory"
import SettingsNav from "./SettingsNav"

/*
  PHASE 18 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Enhanced Settings (Tabbed version)

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
