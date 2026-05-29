import { useState } from 'react'
import './MainPage.css'

//COMPONENTS CONDITIONALLY SHOWN WITHIN
import Landing from '../components/Landing'
import Transactions from '../components/Transactions'
import Budgets from '../components/Budgets'
import Analytics from '../components/Analytics'
import Settings from '../components/Settings'

const TABS = [
  { label: 'Landing', component: <Landing /> },
  { label: 'Transaction', component: <Transactions /> },
  { label: 'Budgets', component: <Budgets /> },
  { label: 'Analytics', component: <Analytics /> },
  { label: 'Settings', component: <Settings /> },
]

export default function MainPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="main-page-wrapper">
      <div className="top-bar"></div>
      <div className="main-page">
        <nav>
          {TABS.map((tab, i) => (
            <button key={tab.label} onClick={() => setActiveTab(i)} disabled={activeTab === i}>
              {tab.label}
            </button>
          ))}
        </nav>
        <main>
          {TABS[activeTab].component}
        </main>
      </div>
    </div>
  )
}
