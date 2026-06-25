import {useState, useEffect} from 'react'
import {api} from '../api'
import "./AddTransaction.css"

export default function AddTransaction() {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [vendor, setVendor] = useState("");
    const [category, setCategory] = useState("");

    const submitTransaction = () => {
        // Convert category and entity to IDs
        console.log(date);
        api("/transactions", {method: 'POST', body: {category_id: 1, vendor_id: vendor, amount: amount, transaction_date: date}}).then()
    }


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
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="entertainment">Entertainment</option>
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
