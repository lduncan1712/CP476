import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])

  // Load this user's budgets once when the tab opens.
  useEffect(() => {
    api('/budgets').then(setBudgets)
  }, [])

  return (
    <div>
      <h2>Budgets</h2>
      {budgets.map(b => (
        <p key={b.id}>
          ${b.amount} (category {b.category_id}) from {b.budget_start}
        </p>
      ))}
    </div>
  )
}
