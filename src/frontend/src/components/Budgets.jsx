import { useState, useEffect } from 'react';
import { api } from '../api';
import BudgetCard from './BudgetCard';
import BudgetPopup from './BudgetPopup';
import './Budgets.css';

function daysLeft(budgetEnd) {
  const diff = new Date(budgetEnd) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Budgets() {

  const [budgets, setBudgets] = useState([]);
  const [spentByBudget, setSpentByBudget] =useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    api('/budgets').then(setBudgets);
  }, []);

  useEffect(() => {
    Promise.all(
      budgets.map(budget =>
        api(`/transactions?category_id=${budget.category_id}&start=${budget.budget_start}&end=${budget.budget_end}`)
          .then(txns => [budget.id, txns.reduce((sum, t) => sum + Number(t.amount), 0)])
      )
    ).then(entries => setSpentByBudget(Object.fromEntries(entries)));
  }, [budgets]);

  function handleAddBudget(newBudget) {
  const alreadyExists = budgets.some(
    budget => budget.category_id === newBudget.category_id
  );

  if (alreadyExists) {
    alert("A budget for this category already exists.");
    return;
  }

  api('/budgets', { method: 'POST', body: JSON.stringify(newBudget) }).then(created => {
    setBudgets(prev => [...prev, created]);
    setShowPopup(false);
  });
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
      category={budget.category_name}
      amount={Number(budget.amount)}
      spent={spentByBudget[budget.id] ??  0}
      days_left={daysLeft(budget.budget_end)}
    />
  ))}
</div>
    </>
  );
}