import { useState, useEffect } from "react";
import { api } from "../api";
import BudgetCard from "./BudgetCard";
import TransactionsTable from "./TransactionsTable";
import "./Landing.css";

function daysLeft(budgetEnd) {
    const diff = new Date(budgetEnd) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Landing() {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    // Today's date
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Load newest 3 transactions
    useEffect(() => {
        api("/transactions").then((data) => {
            const recentTransactions = data
                .sort(
                    (a, b) =>
                        new Date(b.transaction_date) - new Date(a.transaction_date)
                )
                .slice(0, 3);

            setTransactions(recentTransactions);
        });
    }, []);

    useEffect(() => {
        api("/budgets").then((budgets) => {
            Promise.all(
                budgets.map((budget) =>
                    api(`/transactions?category_id=${budget.category_id}&start=${budget.budget_start}&end=${budget.budget_end}`)
                        .then((transactions) => ({
                            ...budget,
                            total_spent: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
                        }))
                )
            ).then((budgets) => {
                setTotalAmount(budgets.reduce((sum, b) => sum + Number(b.amount), 0));
                setTotalSpent(budgets.reduce((sum, b) => sum + b.total_spent, 0));
                const sorted = budgets
                    .sort((a, b) => (b.total_spent / b.amount) - (a.total_spent / a.amount))
                    .slice(0, 3);
                setBudgets(sorted);
            });
        });
    }, []);

    return (
        <div className="landing-container">

            {/* Top Row */}
            <div className="welcome-box">
                <h2>Hello!</h2>
            </div>

            <div className="date-box">
                <h2>Date: {today}</h2>
            </div>

            {/* Middle Row */}
            <div className="overall-budget">
                <BudgetCard
                    category="Overall Spending"
                    amount={totalAmount}
                    spent={totalSpent}
                    days_left={null}
                />
            </div>

            <div className="recent-transactions landing-transactions">
                <h2>Recent Transactions</h2>
                <TransactionsTable
                    rows={transactions}
                    onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))}
                />
            </div>

            {budgets.map((budget) => (
                <BudgetCard
                    category={budget.category_name}
                    amount={Number(budget.amount)}
                    spent={Number(budget.total_spent)}
                    days_left={daysLeft(budget.budget_end)}
                />
            ))}

        </div>
    );
}
