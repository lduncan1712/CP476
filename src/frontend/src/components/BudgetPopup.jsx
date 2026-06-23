import { useState } from "react";
import "./BudgetPopup.css";

export default function BudgetPopup({ onClose }) {

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeats, setRepeats] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      category,
      amount,
      startDate,
      endDate,
      repeats
    });

    onClose();
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
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