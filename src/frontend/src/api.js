// Shared helper for backend calls. Every component imports api() from here,
// so the base URL and auth token live in one place.
const BASE = 'http://localhost:8080/index.php' // TODO: move to env var when deployed
const TOKEN = 'eyJ1c2VyX2lkIjoxfQ==' // TODO: replace with real auth token (currently {"user_id":1})

export async function api(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      ...options.headers,
    },
  })
  return res.json()
}
