import { useState, useEffect } from 'react'
import { api } from '../api'
// import line_graph from '../assets/line_graph.png';
// import line_with_overlay from '../assets/line_with_overlay.png';
// import yearview_graph from '../assets/yearview_graph.png';
// import piechart from '../assets/piechart.png';
import YearLineChart from "./YearLineChart";
import MonthLineChart from "./MonthLineChart";
import PieChart from "./PieChart";
import './Analytics.css'

export default function Analytics() {

    // Get current month and year
    const now = new Date()
    const monthDay = now.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});

    // Get data
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        api('/transactions').then(setTransactions)
    }, [])

    // Data is hard-coded for now
    const totalBudget = 200;
    // Data split by category for this current month
    const categoryData = [
        { category: "Groceries", amount: 32.55},
        { category: "Transportation", amount: 300.52},
        { category: "Clothing", amount: 38.25},
        { category: "Utilities", amount: 170.02},
        { category: "Entertainment", amount: 65.57}
    ];
    // Data by day (most granular form)
    const dailyData = [{ transactionDate: new Date("9/10/2023"), amount: 32.55, category_id:  "Transportation" },
    { transactionDate: new Date("9/11/2023"), amount: 300.52, category_id:  "Transportation" },
    { transactionDate: new Date("9/22/2023"), amount: 38.25, category_id:  "Transportation" },
    { transactionDate: new Date("10/23/2024"), amount: 50.02, category_id:  "Transportation" },
    { transactionDate: new Date("9/10/2025"), amount: 32.55, category_id:  "Clothing" },
    { transactionDate: new Date("9/11/2025"), amount: 300.52, category_id:  "Entertainment" },
    { transactionDate: new Date("9/22/2025"), amount: 38.25, category_id:  "Utilities" },
    { transactionDate: new Date("10/10/2025"), amount: 15.55, category_id:  "Clothing" },
    { transactionDate: new Date("10/23/2025"), amount: 50.02, category_id:  "Groceries" },
    { transactionDate: new Date("11/1/2025"), amount: 170.02, category_id:  "Clothing" },
    { transactionDate: new Date("6/2/2026"), amount: 10.0, category_id:  "Entertainment" },
    { transactionDate: new Date("6/12/2026"), amount: 10.0, category_id:  "Groceries" },
    { transactionDate: new Date("6/1/2026"), amount: 10.0, category_id:  "Transportation" },
    { transactionDate: new Date("5/1/2026"), amount: 25.00, category_id:  "Transportation" },
    { transactionDate: new Date("6/23/2026"), amount: 30.00, category_id:  "Groceries" },
    { transactionDate: new Date("5/20/2026"), amount: 40.00, category_id:  "Clothing" }];

    // Filtered data for this month
    const currentMonthData = dailyData.filter(item => {
        const date = item.transactionDate;
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    // Filtered data for last month
    const lastMonthData = dailyData.filter(item => {
        const date = item.transactionDate;
        return date.getMonth() === (now.getMonth() - 1) && date.getFullYear() === now.getFullYear();
    });

    // Get statistics
    var monthExpenses = 0;
    var lastMonthExpenses = 0;
    var maxExpense = 0;
    var maxExpenseCatAmount = 0;
    var maxExpenseDate;
    var maxExpenseCat;
    var month_difference_pct = 0;
    var maxIncreaseCat = "Utilities";
    var maxIncreasePct = "2%";
    var maxDecreaseCat = "Groceries";
    var maxDecreasePct = "13%";

    // Later: If time, implement for reusability
    // function findMaxExpense() {
    //     var maxExpense = 0;
    //     var maxExpenseCat;
    //     return [maxExpense, maxExpenseCat]
    // }

    // Calculate pct_overallbudget_used
    for (let expense of categoryData) {
        // Iterate to find max expense category
        if (expense.amount > maxExpenseCatAmount) {
            maxExpenseCatAmount = expense.amount;
            maxExpenseCat = expense.category;
        }
    }

    // Find date of this month with highest expenses
    for (let expense of currentMonthData) {
        // Calculate total expenses for this month for percentage calculation
        monthExpenses += expense.amount;

        // Iterate to find max expense date
        if (expense.amount > maxExpense) {
            maxExpense = expense.amount;
            maxExpenseDate = expense.transactionDate;
        }
    }
    var percentUsed = (monthExpenses / totalBudget * 100).toFixed(0) + "%"

    // Calculate month_difference_pct
    for (let expense of lastMonthData) {
        lastMonthExpenses += expense.amount;
    }
    month_difference_pct = 100 * (monthExpenses-lastMonthExpenses) / lastMonthExpenses

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
                    <MonthLineChart data={dailyData} overlayOn={hasOverlay}></MonthLineChart> :
                    <YearLineChart
                     data={dailyData}
                     xLabel={"Year"}
                     />}
                     
                    <figcaption>The above graph shows the total expenses over time, until this current day</figcaption>
                </figure>
                <div class = "card-content">
                    { // Show overlay option only for month graph
                    isMonthview ? (
                    <>
                        <h2>{monthDay}</h2>
                        <label for = "overlay-check" class = "line_graph_options">Compare with last month</label>
                        <input id = "overlay-check" type="checkbox" checked={hasOverlay} onChange={() => setOverlay(!hasOverlay)} class = "line_graph_options"/>
                    </>) : (<h2>Your Expenses Through the Years</h2>)}
                    <button type="button"
                     className={`line_graph_options ${isMonthview ? 'chart-no-overlay' : 'chart-overlay'}`}
                     onClick={ // overlay option only available for monthview
                        () => {setMonthview(!isMonthview); setOverlay(false)}
                     }>
                        Year-view
                    </button>
                    <div class = "points">
                        <ul>
                            <li>You have used up <strong>{percentUsed}</strong> of your budget so far (${monthExpenses.toFixed(2)} from ${totalBudget.toFixed(2)}).</li>
                            <li>Compared to last month's expenses, which totaled to <strong>${lastMonthExpenses.toFixed(2)}</strong>, you spent <strong>{Math.abs(month_difference_pct).toFixed(2)}% {month_difference_pct >= 0 ? "more":"less"}</strong></li>
                            </ul>
                    </div>
                </div>
            </article>
            <article class = "analytics_card">
                <figure id = "breakdown_chart">
                    <h2>Month Breakdown</h2>
                    <PieChart data={dailyData} />
                    <figcaption>This graph shows a breakdown of this month's expenses by category</figcaption>
                </figure>
                <div class = "card-content">
                    <div class = "points">
                        <ul>
                            <li>You had the highest expenses in the <strong>{maxExpenseCat}</strong> category this month, with a total of <strong>${maxExpenseCatAmount.toFixed(2)}</strong>.</li>
                            <li><strong>{maxIncreaseCat}</strong> has had the biggest increase in expenses this month, by <strong>{maxIncreasePct}</strong>.</li>                         
                            <li><strong>{maxDecreaseCat}</strong> has had the biggest decrease in expenses this month, by <strong>{maxDecreasePct}</strong>.</li>
                            <li>You are over budget in the following categories: <strong>Transportation, Groceries</strong>.</li>
                        </ul>
                    </div>
                </div>
            </article>
        </section>
    </div>
  )
}

//<img src={hasOverlay ? line_graph : line_with_overlay} alt="Line graph" style={{ width: '400px', height: '250px', display: 'block', margin: '10px auto' }}/>//<li>Your expenses were highest on the date <strong>{maxExpenseDate}</strong> with a total of <strong>${maxExpense.toFixed(2)}</strong>.</li> {/*Individual budgets by ctaegory not yet linked */}
                        