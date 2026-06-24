import { useState, useEffect } from 'react'

export default function EditTransactionPopup({transaction, onClose}) {
    const [amount, setAmount] = useState(transaction?.amount || 0);
    const [date, setDate] = useState(transaction?.date || "");
    const [vendor, setVendor] = useState(transaction?.vendor || "");
    const [category, setCategory] = useState(transaction?.category || "");


    // Needs to eventually pass transaction id so that transactions can be updated in the database
    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount || 0)
            setDate(transaction.date || "")
            setVendor(transaction.vendor || "")
            setCategory(transaction.category || "")
        }
    }, [transaction])

    const handleSubmit = (e) => {
        e.preventDefault()
        onClose()
    }


    return (
        <div className={"overlay"}>
            <div className={"popup"}>
                <div className="banner">
                    <h2>Edit this transaction</h2>

                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form >
                    <input
                        className="field"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <input
                        className="field"
                        type="text"
                        placeholder="Date (DD/MM/YYYY)"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <input
                        className={"field"}
                        type={"text"}
                        placeholder={"Vendor"}
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                    />

                    <select
                        className="field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Category</option>
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="entertainment">Entertainment</option>
                    </select>

                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </form>

            </div>
        </div>
    )
}
