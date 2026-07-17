import { useState } from 'react'
import './TransactionTable.css'
import EditTransactionPopup from "./EditTransactionPopup.jsx";
import {api} from "../api.js";

/* Transaction table component.
* Pass rows of transaction data to use.
* Each row of data should be a map containing row.amount, row.date, row.vendor, and row.category
* When connected to the API, should also pass row.id, so that transactions can be edited and deleted.
*/

export default function TransactionsTable({ rows: transactions = [], onDelete }) {
    const [selectedTransaction, setSelectedTransaction] = useState("")
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const deleteTransaction = (transaction) => {
        const confirm = window.confirm('Are you sure you want to delete this transaction?')
        if (confirm) {
            api(("/transactions?id=" + transaction.id), {method: 'DELETE'}).then(() => {
                onDelete(transaction.id)
            }).catch(err =>{
                alert("Failed to delete transaction. Please try again." + err)
        })
        }
    }

    return (
        <div className="transactions-table">
            <table className="transactions-table__table">
                <thead>
                <tr>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((row) => (
                    <tr key={row.id}>
                        <td className="amount">{row.amount}</td>
                        <td className="date">{row.transaction_date}</td>
                        <td className="vendor">{row.entity_name}</td>
                        <td className="category">{row.category_name}</td>
                        <td className="actions">
                            <button
                                className="btn btn-edit"
                                onClick={() => {
                                    setEditDialogOpen(true)
                                    setSelectedTransaction(row.id)
                                }}
                            >
                                Edit
                            </button>

                            <button className="btn btn-delete" onClick={() => deleteTransaction(row)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {editDialogOpen &&
                (<EditTransactionPopup
                    transaction={selectedTransaction}
                    onClose={() => setEditDialogOpen(false)}
                />)
            }
        </div>
    )
}
