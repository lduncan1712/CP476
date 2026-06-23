import BudgetCard from "./BudgetCard";

export default function Landing() {
  return (
    <div>
      <h1>Landing Page</h1>
      <BudgetCard 
        category="Groceries" 
        amount={500} 
        spent={300} 
        days_left={10} 
      />
    </div>
  )
}

