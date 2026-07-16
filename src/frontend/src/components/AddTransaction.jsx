import {useState, useEffect} from 'react'
import {api} from '../api'
import "./AddTransaction.css"
import {useCategories} from "../contexts/CategoryContext.jsx";
import {useEntities} from "../contexts/EntitiesContext.jsx";

export default function AddTransaction({setTransaction}) {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [vendor, setVendor] = useState("");
    const [category, setCategory] = useState("");
    const [entities, setEntities] = useState([])
    const categories = useCategories();

    useEffect(() => {
        api('/entities').then(setEntities)
    }, [])

    const submitTransaction = () => {
        // Convert category and entity to IDs
        api("/transactions", {method: 'POST', body: JSON.stringify({category_id: 1, entity_id: 3, amount: amount, transaction_date: date})}).then()
    }

    console.log(entities)

    return (
        <div id={"form-div"}>
            <form>
                <div className={"form-row"}>
                    <h4>Amount $</h4>
                    <input
                        className="field"
                        placeholder="$000.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                </div>

                <div className={"form-row"}>
                    <h4>Date</h4>
                    <input
                        className="field"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    /></div>

                <div className={"form-row"}>
                    <h4>Vendor</h4>
                    <input
                        className="field"
                        type={"text"}
                        placeholder={"Vendor"}
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                    />
                </div>

                <div className={"form-row"}>
                    <h4>Category</h4>
                    <select
                        className="field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select One</option>
                        {categories.map((category) => (
                            <option value={category.id}>{category.name}</option>
                            ))}
                    </select>
                </div>

                <div
                    className={"submit-button"}
                    onClick={submitTransaction}
                >
                    <button>Add Expense</button>
                </div>
            </form>
        </div>
    )
}
