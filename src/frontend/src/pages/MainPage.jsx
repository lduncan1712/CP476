import './MainPage.css'

//COMPONENTS CONDITIONALLY SHOWN WITHIN
import Landing from '../components/Landing'
import Transactions from '../components/Transactions'
import Budgets from '../components/Budgets'
import Analytics from '../components/Analytics'
import {Link as RouterLink, Outlet, useLocation, useNavigate} from "react-router-dom";

const TABS = [
  { label: 'Landing', component: <Landing />, path: '/dashboard/home' },
  { label: 'Transaction', component: <Transactions />, path: '/dashboard/transactions' },
  { label: 'Budgets', component: <Budgets />, path: '/dashboard/budgets' },
  { label: 'Analytics', component: <Analytics />, path: '/dashboard/analytics' },
  // { label: 'Settings', component: <Settings /> },
]

export default function MainPage() {
  const { pathname } = useLocation()

  return (
    <div className="main-page-wrapper">
      <div className="top-bar">The Budget App</div>
      <div className="main-page">
        <nav>
          {TABS.map((tab) => (
            <RouterLink key={tab.label} to={tab.path}>
              <button disabled={pathname === tab.path}>
                {tab.label}
              </button>
            </RouterLink>
          ))}
        </nav>
        <main>

          <Outlet/>
        </main>
      </div>
    </div>
  )
}
