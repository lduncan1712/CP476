import BudgetCard from "./BudgetCard";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">

      <div className="welcome-box">
        <h2>Hello Bob!</h2>
      </div>

      <div className="date-box">
        <h2>Date: Monday, May 25th, 2026</h2>
      </div>

      <div className="overall-budget">
        <BudgetCard
          category="Overall Spending"
          amount={1000}
          spent={600}
          days_left={4}
        />
      </div>

      <div className="transactions-placeholder">
        {/* Table here */}
      </div>

      <BudgetCard category="Groceries" amount={250} spent={171} days_left={4} />
      <BudgetCard category="Transportation" amount={100} spent={98} days_left={4} />
      <BudgetCard category="Entertainment" amount={150} spent={173} days_left={4} />

    </div>
  );
}