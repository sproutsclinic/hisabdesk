ï»¿"use client"

type Props = {
  income: number
  expense: number
  tax: number
}

export default function BurnMeter({ income, expense, tax }: Props) {
  const used = expense + tax
  const percent = income ? Math.min((used / income) * 100, 100) : 0

  return (
    <div className="card space-y-4">

      <h3 className="text-sm font-medium text-zinc-500">
        Burn Meter
      </h3>

      <div className="w-full bg-zinc-200 rounded-full h-3">
        <div
          className="h-3 bg-black rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-xs text-zinc-600 flex justify-between">
        <span>Spent + Tax: ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {used.toLocaleString()}</span>
        <span>{percent.toFixed(0)}%</span>
      </div>
    </div>
  )
}
