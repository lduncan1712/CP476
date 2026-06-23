import { useState } from 'react'
import './TransactionTable.css'
import EditTransactionPopup from "./EditTransactionPopup.jsx";

/* Transaction table component.
* Pass rows of transaction data to use.
* Each row of data should be a map containing row.amount, row.date, row.vendor, and row.category
* When connected to the API, should also pass row.id, so that transactions can be edited and deleted.
*/

export default function TransactionsTable({ rows = [] }) {
    const [selectedTransaction, setSelectedTransaction] = useState("")
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const deleteTransaction = (transaction) => {
        const confirm = window.confirm('Are you sure you want to delete this transaction?')
        if (confirm) {
            // API Call stub
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
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td className="amount">{row.amount}</td>
                        <td className="date">{row.date}</td>
                        <td className="vendor">{row.vendor}</td>
                        <td className="category">{row.category}</td>
                        <td className="actions">
                            <button
                                className="btn btn-edit"
                                onClick={() => {
                                    setEditDialogOpen(true)
                                    setSelectedTransaction(rows[index])
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
