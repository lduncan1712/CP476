import { useState, useEffect } from 'react' // React's built-in hooks for state and lifecycle management
import { api } from '../api' // A helper function to make API calls, defined in a separate file
import BudgetPopup from './BudgetPopup'

export default function Budgets() { //Defines a React component called Budgets (export default means other files can use import Budgets from './Budgets' to display this page)
  const [budgets, setBudgets] = useState([]) //use state lets components store data that can change overtime. 
  //Here we initialize budgets as an empty array, and setBudgets is the function we can call to update that state when we get data from the API.
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the Add Budget popup

  // Load this user's budgets once when the tab opens.
  useEffect(() => {
    api('/budgets').then(setBudgets) //"When the data arrives, pass it into setBudgets"
  }, [])//Wmpty array at the end means "Only run this effect once when the page loads"



  return (
    <div>
      <h2>Budgets</h2>
      
        <button onClick={() => setShowPopup(true)}>
        Add Budget
      </button>

      

      {showPopup && (
  <BudgetPopup onClose={() => setShowPopup(false)} />
)}
      
      {budgets.map(b => ( //map loops over each budget in the JSON
        <p key={b.id}> 
          ${b.amount} (category {b.category_id}) from {b.budget_start}
        </p>//key helps react identify each item uniquly
        //the line below prints the output, specifies budget amount, category number and date
      ))}
    </div>

    



  )
}
