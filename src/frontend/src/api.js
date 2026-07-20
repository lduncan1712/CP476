// Shared helper for backend calls. Every component imports api() from here,
// so the base URL and auth token live in one place.
const BASE = 'http://localhost:8080/index.php' // TODO: move to env var when deployed

export async function api(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  return res.json()
}
