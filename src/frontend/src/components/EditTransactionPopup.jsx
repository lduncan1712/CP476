import { useState, useEffect } from 'react'
import "./Popup.css";
import {api} from "../api.js";
import {useCategories} from "../contexts/CategoryContext.jsx";

export default function EditTransactionPopup({transaction, onClose}) {
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [entity, setEntity] = useState("");
    const [category, setCategory] = useState(-1);
    const categories = useCategories()


    // Needs to eventually pass transaction id so that transactions can be updated in the database
    useEffect(() => {
        if (transaction) {
            api(('/transactions?id=' + transaction)).then(result => {
                console.log(result[0])
                if (result.length !== 1) {
                    window.alert("An error occurred");
                    onClose()
                } else {
                    result = result[0]
                    setAmount(result.amount || 0)
                    setDate(result.transaction_date || "")
                    setEntity(result.entity_name || "")
                    setCategory(result.category_id || -1)
                }
            })
        }

    }, [transaction])

    const getEntityId = async () => {
        const result = await api("/entities", {method: 'POST', body: JSON.stringify({name: entity})});
        return result.id;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const entityId = await getEntityId()
        if (entityId < 0) {
            window.alert("Please select a valid entity or add a new one.")
        } else if (category < 0) {
            window.alert("Please select a valid category.")
        } else if (amount < 0) {
            window.alert("Amount cannot be less than 0.")
        } else {
            await api(("/transactions?id=" + transaction), {method: 'PUT', body: JSON.stringify({category_id: category, entity_id: entityId, amount: amount, transaction_date: date})}).then(() => {
                // TODO: reload page, implement once routes are added.
            })
        }
        onClose()
    }


    return (
        <div className={"overlay"}>
            <div className={"popup"}>
                <div className="banner">
                    <h2>Edit Transaction</h2>

                    <button className="close-btn" onClick={onClose}>×</button>
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
                        type="date"
                        placeholder="Date (DD/MM/YYYY)"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <input
                        className={"field"}
                        type={"text"}
                        placeholder={"Vendor"}
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                    />

                    <select
                        className="field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((category) => (
                            <option value={category.id}>{category.name}</option>
                        ))}
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
