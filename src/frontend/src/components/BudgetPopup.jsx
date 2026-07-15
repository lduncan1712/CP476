import { useState, useEffect } from "react";
import { api } from "../api";
import "./Popup.css";

const DURATION_IDS ={ weekly: 2, monthly: 3, yearly: 4 };

export default function BudgetPopup({ onClose, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeats, setRepeats] = useState("");

  useEffect(() => {
    api('/categories').then(setCategories);
  }, []);

  function toISODate(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

 function isValidDate(dateString) {
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
} 
  
  
function handleSubmit(e) {
  e.preventDefault();

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (categoryId === "") {
    alert("Please select a category.");
    return;
  }

  if (Number(amount) <= 0) {
    alert("Budget amount must be greater than $0.");
    return;
  }

  if (!dateRegex.test(startDate)) {
    alert("Start Date must be in DD/MM/YYYY format.");
    return;
  }

  if (!dateRegex.test(endDate)) {
    alert("End Date must be in DD/MM/YYYY format.");
    return;
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    alert("Please enter valid calendar dates.");
    return;
  }

  if (repeats === "") {
    alert("Please select how often this budget repeats.");
    return;
  }

  onSubmit({
    category_id: Number(categoryId),
    amount: Number(amount),
    duration_id: DURATION_IDS[repeats],
    budget_start: toISODate(startDate),
    budget_end: toISODate(endDate),
  });
}
  return (
    <div className="overlay">

      <div className="popup">

        <div className="banner">
          <h2>Add a budget</h2>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <select
            className="field"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            className="field"
            type="number"
            min="0"
            step="1.00"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="field"
            type="text"
            placeholder="Start Date (DD/MM/YYYY)"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            className="field"
            type="text"
            placeholder="End Date (DD/MM/YYYY)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <select
            className="field"
            value={repeats}
            onChange={(e) => setRepeats(e.target.value)}
          >
            <option value="">Repeats</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button className="submit-btn">
            Submit
          </button>

        </form>

      </div>

    </div>
  );
}
