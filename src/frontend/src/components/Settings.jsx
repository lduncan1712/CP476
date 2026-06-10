import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Settings() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')

  // Load the user once, and seed the input with their current name.
  useEffect(() => {
    api('/users').then(u => { setUser(u); setName(u.name) })
  }, [])

  if (!user) return <div>Loading…</div>

  // Save the edited name, then refresh the displayed user.
  const save = () =>
    api('/users', { method: 'PUT', body: JSON.stringify({ name }) }).then(setUser)

  return (
    <div>
      <h2>Settings</h2>
      <p>Member since: {user.created_on}</p>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={save}>Save</button>
    </div>
  )
}
