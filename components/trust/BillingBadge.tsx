ï»¿"use client"

export default function BillingBadge({ isPro }: { isPro: boolean }) {
  return (
    <div
      className={`
        text-xs px-2 py-1 rounded-full font-medium
        ${isPro ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}
      `}
    >
      {isPro ? "Pro Plan" : "Free Plan"}
    </div>
  )
}
