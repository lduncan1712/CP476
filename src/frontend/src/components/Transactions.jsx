import { useState, useEffect } from 'react'
import { api } from '../api'
import AddTransaction from "./AddTransaction.jsx";
import TransactionsTable from "./TransactionsTable.jsx";
import "./Transactions.css"

export default function Transactions() {
  const [transactions, setTransactions] = useState([])

  // Load this user's transactions once when the tab opens.
  useEffect(() => {
    api('/transactions').then(setTransactions)
  }, [])

  return (
    <div>
      <h2>Transactions</h2>
        <div id={"transaction-page-layout"}>
            <AddTransaction/>
            <TransactionsTable
                rows={transactions}
                onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))}
            />
        </div>
    </div>
  )
}
