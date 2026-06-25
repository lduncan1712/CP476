import { useState, useEffect } from "react";
import { api } from "../api";
import BudgetCard from "./BudgetCard";
import TransactionsTable from "./TransactionsTable";
import "./Landing.css";

export default function Landing() {
  const [transactions, setTransactions] = useState([]);

  // Today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Load transactions and keep only newest 3
  useEffect(() => {
    api("/transactions").then((data) => {
      const recentTransactions = data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

      setTransactions(recentTransactions);
    });
  }, []);

  return (
    <div className="landing-container">

      {/* Top Row */}
      <div className="welcome-box">
        <h2>Hello Bob!</h2>
      </div>

      <div className="date-box">
        <h2>Date: {today}</h2>
      </div>

      {/* Middle Row */}
      <div className="overall-budget">
        <BudgetCard
          category="Overall Spending"
          amount={1000}
          spent={600}
          days_left={4}
        />
      </div>

      <div className="transactions-placeholder landing-transactions">
        <TransactionsTable rows={transactions} />
      </div>

      {/* Bottom Row */}
      <BudgetCard
        category="Groceries"
        amount={250}
        spent={171}
        days_left={4}
      />

      <BudgetCard
        category="Transportation"
        amount={100}
        spent={98}
        days_left={4}
      />

      <BudgetCard
        category="Entertainment"
        amount={150}
        spent={173}
        days_left={4}
      />

    </div>
  );
}