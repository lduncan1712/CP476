import { useState } from 'react'

//PAGES
import Login from './pages/Login'
import MainPage from './pages/MainPage'
import {CategoriesProvider} from "./contexts/CategoryContext.jsx";
import {EntitiesProvider} from "./contexts/EntitiesContext.jsx";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
      <CategoriesProvider>
        <EntitiesProvider>
          <MainPage/>
        </EntitiesProvider>
      </CategoriesProvider>

  )
}
