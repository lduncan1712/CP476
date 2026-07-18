import { useState } from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

//PAGES
import Login from './pages/Login'
import MainPage from './pages/MainPage'
import {CategoriesProvider} from "./contexts/CategoryContext.jsx";
import Landing from "./components/Landing.jsx";
import Transactions from "./components/Transactions.jsx";
import Budgets from "./components/Budgets.jsx";
import Analytics from "./components/Analytics.jsx";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (

    <CategoriesProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route
                    path="/dashboard/*"
                    element={<MainPage/>}
                >
                    <Route path="" element={<Navigate to="home" replace/>}/>
                    <Route path="home" element={<Landing/>}/>
                    <Route path="transactions" element={<Transactions/>}/>
                    <Route path="budgets" element={<Budgets/>}/>
                    <Route path="analytics" element={<Analytics/>}/>
                </Route>
            </Routes>

        </BrowserRouter>

    </CategoriesProvider>


  )



}
