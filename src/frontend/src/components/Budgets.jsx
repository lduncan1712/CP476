import { useState } from 'react';
import BudgetCard from './BudgetCard';
import BudgetPopup from './BudgetPopup';
import './Budgets.css';

export default function Budgets() {

  const [budgets, setBudgets] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  function handleAddBudget(newBudget) {
  const alreadyExists = budgets.some(
    budget => budget.category === newBudget.category
  );

  if (alreadyExists) {
    alert(`A ${newBudget.category} budget already exists.`);
    return;
  }

  setBudgets(prev => [...prev, newBudget]);
  setShowPopup(false);
}

  return (
    <>
      <button onClick={() => setShowPopup(true)}>
        Add Budget
      </button>

      {showPopup && (
        <BudgetPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleAddBudget}
        />
      )}

      <div className="budget-grid">
  {budgets.map(budget => (
    <BudgetCard
      key={budget.id}
      category={budget.category}
      amount={budget.amount}
      spent={budget.spent}
      days_left={budget.days_left}
    />
  ))}
</div>
    </>
  );
}