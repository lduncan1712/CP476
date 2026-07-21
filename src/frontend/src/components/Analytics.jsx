import { useState, useEffect } from 'react'
import { api } from '../api'
import YearLineChart from "./YearLineChart";
import MonthLineChart from "./MonthLineChart";
import PieChart from "./PieChart";
import './Analytics.css'

export default function Analytics() {

    // Get current month and year
    const now = new Date()
    const monthDay = now.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});

    // ---------------------------------------------------------
    // Pull data from the backend (same pattern as Transactions.jsx)
    // ---------------------------------------------------------
    const [transactions, setTransactions] = useState([])
    const [budgets, setBudgets] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        api('/transactions').then(setTransactions)
        api('/budgets').then(setBudgets)
        api('/categories').then(setCategories)
    }, [])

    // ---------------------------------------------------------
    // Normalize transactions
    // The backend sends amount as a string (Postgres DECIMAL over JSON)
    // and transaction_date as a "YYYY-MM-DD" string, so convert both
    // once here instead of everywhere they're used.
    // ---------------------------------------------------------
    const normalizedTransactions = transactions.map(t => ({
        ...t,
        amount: parseFloat(t.amount),
        transactionDate: new Date(t.transaction_date),
    }));

    // The chart components (MonthLineChart, YearLineChart, PieChart) were
    // built against fake data shaped like:
    //   { transactionDate: Date, amount: number, category_id: <category NAME string> }
    // "category_id" holding a name (not the numeric FK) is a leftover misnomer
    // from the placeholder data, but the chart files read that exact field,
    // so we match it here rather than editing three chart files.
    const chartData = normalizedTransactions.map(t => ({
        ...t,
        category_id: t.category_name,
    }));

    // ---------------------------------------------------------
    // Normalize budgets
    // ---------------------------------------------------------
    const normalizedBudgets = budgets.map(b => ({
        ...b,
        amount: parseFloat(b.amount),
        budget_start: new Date(b.budget_start),
        budget_end: b.budget_end ? new Date(b.budget_end) : null,
    }));

    // Only budgets whose date range covers today
    const activeBudgets = normalizedBudgets.filter(b =>
        b.budget_start <= now && (!b.budget_end || b.budget_end >= now)
    );

    // An "overall" budget has no category attached (category_id is null)
    const overallBudget = activeBudgets.find(b => b.category_id === null);
    const totalBudget = overallBudget ? overallBudget.amount : null;

    // Map numeric category_id -> name, for matching per-category budgets
    // (GET /budgets doesn't join category name the way /transactions does)
    const categoryIdToName = Object.fromEntries(categories.map(c => [c.id, c.name]));

    // ---------------------------------------------------------
    // Filter transactions to this month / last month
    // ---------------------------------------------------------
    const currentMonthData = normalizedTransactions.filter(t => {
        const date = t.transactionDate;
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    // Using the Date constructor here (instead of raw getMonth() - 1) so
    // January correctly rolls back to December of the previous year.
    const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthData = normalizedTransactions.filter(t => {
        const date = t.transactionDate;
        return date.getMonth() === lastMonthRef.getMonth() && date.getFullYear() === lastMonthRef.getFullYear();
    });

    // ---------------------------------------------------------
    // Group each month's transactions by category
    // ---------------------------------------------------------
    function groupByCategory(items) {
        const totals = {};
        for (const t of items) {
            totals[t.category_name] = (totals[t.category_name] || 0) + t.amount;
        }
        return totals;
    }

    const categoryTotals = groupByCategory(currentMonthData);
    const lastMonthCategoryTotals = groupByCategory(lastMonthData);

    // ---------------------------------------------------------
    // Overall stats for this month
    // ---------------------------------------------------------
    let monthExpenses = 0;
    let maxExpense = 0;
    let maxExpenseDate = null;
    for (const t of currentMonthData) {
        monthExpenses += t.amount;
        if (t.amount > maxExpense) {
            maxExpense = t.amount;
            maxExpenseDate = t.transactionDate;
        }
    }

    let lastMonthExpenses = 0;
    for (const t of lastMonthData) {
        lastMonthExpenses += t.amount;
    }

    const percentUsed = totalBudget ? (monthExpenses / totalBudget * 100).toFixed(0) + "%" : null;

    // Guarded against divide-by-zero when last month had no spending
    const month_difference_pct = lastMonthExpenses > 0
        ? 100 * (monthExpenses - lastMonthExpenses) / lastMonthExpenses
        : (monthExpenses > 0 ? 100 : 0);

    // Highest-spend category this month
    let maxExpenseCat = null;
    let maxExpenseCatAmount = 0;
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > maxExpenseCatAmount) {
            maxExpenseCatAmount = amount;
            maxExpenseCat = category;
        }
    }

    // Biggest month-over-month % increase / decrease, per category
    const touchedCategories = new Set([
        ...Object.keys(categoryTotals),
        ...Object.keys(lastMonthCategoryTotals),
    ]);

    let maxIncreaseCat = null, maxIncreasePct = 0;
    let maxDecreaseCat = null, maxDecreasePct = 0;

    for (const category of touchedCategories) {
        const current = categoryTotals[category] || 0;
        const prior = lastMonthCategoryTotals[category] || 0;
        if (current === 0 && prior === 0) continue;

        const pctChange = prior > 0 ? ((current - prior) / prior) * 100 : 100;

        if (maxIncreaseCat === null || pctChange > maxIncreasePct) {
            maxIncreaseCat = category;
            maxIncreasePct = pctChange;
        }
        if (maxDecreaseCat === null || pctChange < maxDecreasePct) {
            maxDecreaseCat = category;
            maxDecreasePct = pctChange;
        }
    }

    // Categories currently over their per-category budget
    const overBudgetCategories = activeBudgets
        .filter(b => b.category_id !== null)
        .map(b => ({ name: categoryIdToName[b.category_id], amount: b.amount }))
        .filter(b => (categoryTotals[b.name] || 0) > b.amount)
        .map(b => b.name);

    // Use boolean states to track which chart settings are currently active
    const [isMonthview, setMonthview] = useState(true);
    const [hasOverlay, setOverlay] = useState(true);

    return (
    <div>
        <h2 id = "analytics-title">Analytics</h2>
        <section class="cards">
            <article class="analytics_card">
                <figure id = "graph-summary">
                    {isMonthview ?
                    <MonthLineChart data={chartData} overlayOn={hasOverlay}></MonthLineChart> :
                    <YearLineChart
                     data={chartData}
                     xLabel={"Year"}
                     />}

                    <div class = "chart-controls">
                        { // Show overlay option only for month graph
                        isMonthview && (
                        <span class = "line_graph_options">
                            <label for = "overlay-check">Compare with last month</label>
                            <input id = "overlay-check" type="checkbox" checked={hasOverlay} onChange={() => setOverlay(!hasOverlay)} />
                        </span>)}
                        <button type="button"
                         className={`chart-toggle-btn ${isMonthview ? 'chart-no-overlay' : 'chart-overlay'}`}
                         onClick={ // overlay option only available for monthview
                            () => {setMonthview(!isMonthview); setOverlay(false)}
                         }>
                            Year-view
                        </button>
                    </div>

                    <figcaption>The above graph shows the total expenses over time, until this current day</figcaption>
                </figure>
                <div class = "card-content">
                    <h2>{isMonthview ? monthDay : "Your Expenses Through the Years"}</h2>
                    <div class = "points">
                        <ul>
                            {totalBudget ? (
                                <li>You have used up <strong>{percentUsed}</strong> of your budget so far (${monthExpenses.toFixed(2)} from ${totalBudget.toFixed(2)}).</li>
                            ) : (
                                <li>No overall budget set for {monthDay} yet — you've spent <strong>${monthExpenses.toFixed(2)}</strong> so far.</li>
                            )}
                            <li>Compared to last month's expenses, which totaled to <strong>${lastMonthExpenses.toFixed(2)}</strong>, you spent <strong>{Math.abs(month_difference_pct).toFixed(2)}% {month_difference_pct >= 0 ? "more":"less"}</strong></li>
                            </ul>
                    </div>
                </div>
            </article>
            <article class = "analytics_card">
                <figure id = "breakdown_chart">
                    <h2>Month Breakdown</h2>
                    <PieChart data={chartData} />
                    <figcaption>This graph shows a breakdown of this month's expenses by category</figcaption>
                </figure>
                <div class = "card-content">
                    <div class = "points">
                        <ul>
                            {maxExpenseCat ? (
                                <li>You had the highest expenses in the <strong>{maxExpenseCat}</strong> category this month, with a total of <strong>${maxExpenseCatAmount.toFixed(2)}</strong>.</li>
                            ) : (
                                <li>No expenses recorded yet this month.</li>
                            )}
                            {maxIncreaseCat && (
                                <li><strong>{maxIncreaseCat}</strong> has had the biggest increase in expenses this month, by <strong>{maxIncreasePct.toFixed(0)}%</strong>.</li>
                            )}
                            {maxDecreaseCat && (
                                <li><strong>{maxDecreaseCat}</strong> has had the biggest decrease in expenses this month, by <strong>{Math.abs(maxDecreasePct).toFixed(0)}%</strong>.</li>
                            )}
                            {overBudgetCategories.length > 0 ? (
                                <li>You are over budget in the following categories: <strong>{overBudgetCategories.join(", ")}</strong>.</li>
                            ) : (
                                <li>You're within budget in all categories that have a budget set.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </article>
        </section>
    </div>
  )
}