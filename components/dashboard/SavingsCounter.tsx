ï»¿"use client"

export default function SavingsCounter({ savings }: { savings: number }) {
  return (
    <div className="card bg-green-50 border-green-200">

      <p className="text-sm text-green-700">
        You saved this year
      </p>

      <h2 className="text-2xl font-bold text-green-800 mt-2">
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {savings.toLocaleString()}
      </h2>

      <p className="text-xs text-green-700 mt-1">
        Smart deductions + regime choice
      </p>
    </div>
  )
}
