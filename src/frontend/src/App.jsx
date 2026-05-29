import { useState } from 'react'

//PAGES
import Login from './pages/Login'
import MainPage from './pages/MainPage'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return <MainPage />
}
