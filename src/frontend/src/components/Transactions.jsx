import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])

  // Load this user's transactions once when the tab opens.
  useEffect(() => {
    api('/transactions').then(setTransactions)
  }, [])

  return (
    <div>
      <h2>Transactions</h2>
      {transactions.map(t => (
        <p key={t.id}>
          {t.transaction_date}: ${t.amount} (category {t.category_id})
        </p>
      ))}
    </div>
  )
}
