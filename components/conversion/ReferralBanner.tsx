"use client"

export default function ReferralBanner() {
  const copy = async () => {
    await navigator.clipboard.writeText(
      "https://hisabdesk.com?ref=invite"
    )
    alert("Referral link copied!")
  }

  return (
    <div className="card flex items-center justify-between">

      <div>
        <p className="text-sm font-medium">
          Refer & earn 1 month FREE
        </p>
        <p className="text-xs text-zinc-500">
          Share with friends
        </p>
      </div>

      <button onClick={copy} className="btn-outline text-xs">
        Copy Link
      </button>
    </div>
  )
}
