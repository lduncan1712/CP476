import {useState, useEffect} from 'react'
import {api} from '../api'
import "./AddTransaction.css"
import {useCategories} from "../contexts/CategoryContext.jsx";

export default function AddTransaction({onAdd}) {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [selectedEntity, setSelectedEntity] = useState("");
    const [newEntityName, setNewEntityName] = useState("")
    const [category, setCategory] = useState("");
    const [entities, setEntities] = useState([])
    const categories = useCategories();
    //added this line 
    const todayStr = new Date().toISOString().split("T")[0];
    useEffect(() => {
        api('/entities').then(setEntities)
    }, [])

    const submitTransaction = async () => {

            // --- Date validation: block future-dated transactions ---
        if (!date) {
            window.alert("Please select a date.")
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(date + "T00:00:00");
        if (isNaN(selectedDate.getTime())) {
            window.alert("Please select a valid date.")
            return;
        }

        if (selectedDate > today) {
            window.alert("Transaction date cannot be in the future.")
            return;
        }
        let entityId;
        if (selectedEntity === "ADD_NEW_ENTITY") {
            entityId = await createEntity();
        } else {
            entityId = selectedEntity;
        }

        if (entityId < 0) {
            window.alert("Please select a valid entity or add a new one.")
        } else if (category < 0) {
            window.alert("Please select a valid category.")
        } else if (amount < 0) {
            window.alert("Amount cannot be less than 0.")
        } else {
            const response = await api("/transactions", {method: 'POST', body: JSON.stringify({category_id: category, entity_id: entityId, amount: amount, transaction_date: date})})
            if (response.error) {
                window.alert(response.error)
            } else {
                onAdd(response)
            }
        }
    }

    const createEntity = async () => {
        const result = await api("/entities", {method: 'POST', body: JSON.stringify({name: newEntityName})});
        return result.id;
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
                    <h4>Entity</h4>

                    <select
                        className="field"
                        value={selectedEntity}
                        onChange={(e) => setSelectedEntity(e.target.value)}
                    >
                        <option value="-1">Select One</option>
                        <option value="ADD_NEW_ENTITY">+ Add New</option>
                        {entities.map((entity) => (
                            <option value={entity.id}>{entity.name}</option>
                        ))}
                    </select>
                </div>

                {selectedEntity === "ADD_NEW_ENTITY" ? (
                    <div className={'form-row'}>
                        <h4>New Entity:</h4>
                        <input
                            className="field"
                            type={"text"}
                            placeholder={"Name"}
                            value={newEntityName}
                            onChange={(e) => setNewEntityName(e.target.value)}
                        />
                    </div>
                ) : null}

                <div className={"form-row"}>
                    <h4>Category</h4>
                    <select
                        className="field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="-1">Select One</option>
                        {categories.map((category) => (
                            <option value={category.id}>{category.name}</option>
                            ))}
                    </select>
                </div>

                <div
                    className={"submit-button"}
                    onClick={submitTransaction}
                >
                    <button
                        type={'button'}
                    >
                        Add Expense
                    </button>
                </div>
            </form>
        </div>
    )
}
