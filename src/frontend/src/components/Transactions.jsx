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


    console.log(transactions)

  return (
    <div>
      <h2>Transactions</h2>
        <div id={"transaction-page-layout"}>
            <AddTransaction/>
            <TransactionsTable rows={transactions}/>
        </div>
      {/*{transactions.map(t => (*/}
      {/*  <p key={t.id}>*/}
      {/*    {t.transaction_date}: ${t.amount} (category {t.category_id})*/}
      {/*  </p>*/}
      {/*))}*/}
    </div>
  )
}
