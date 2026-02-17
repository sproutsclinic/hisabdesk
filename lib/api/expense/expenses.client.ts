ï»¿// ==========================================================
// Expense Client (UI ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ API bridge)
// Extends existing expense client structure
// ==========================================================

export const expensesClient = {
  async create(payload: {
    date: string
    amount: number
    category: string
    notes?: string
  }) {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error("Failed to create expense")

    return res.json()
  },

  async list() {
    const res = await fetch("/api/expenses")

    if (!res.ok) throw new Error("Failed to load expenses")

    return res.json()
  },

  async remove(id: string) {
    const res = await fetch(`/api/expenses?id=${id}`, {
      method: "DELETE",
    })

    if (!res.ok) throw new Error("Failed to delete expense")
  },
}
