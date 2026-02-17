ï»¿export type OnboardingStep = {
  id: string
  title: string
  description: string
  route: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete Profile",
    description: "Add your basic business & tax details",
    route: "/settings",
  },
  {
    id: "income",
    title: "Add First Income",
    description: "Record your first invoice or payment",
    route: "/income",
  },
  {
    id: "expense",
    title: "Track Expenses",
    description: "Add at least one business expense",
    route: "/expense",
  },
  {
    id: "tax",
    title: "Check Tax Calculation",
    description: "See your tax under Old/New/44ADA",
    route: "/dashboard",
  },
  {
    id: "upgrade",
    title: "Upgrade to Pro",
    description: "Unlock reports, exports & automation",
    route: "/billing",
  },
]
