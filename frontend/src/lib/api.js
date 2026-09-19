import axios from 'axios'

/**
 * The backend is optional by design (rule 8). Every call here is best-effort:
 * the UI reads from local storage and never waits on, or fails because of, a
 * request made from this module.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api',
  timeout: 6000,
  headers: { 'X-Guard-Id': 'demo-guard' },
})

/** Resolves to null instead of throwing, so callers need no try/catch. */
async function attempt(request) {
  try {
    return await request()
  } catch {
    return null
  }
}

export const api = {
  createCheckIn: (payload) => attempt(() => client.post('/checkins', payload).then((r) => r.data)),
  listCheckIns: () => attempt(() => client.get('/checkins').then((r) => r.data)),
  deleteCheckIn: (id) => attempt(() => client.delete(`/checkins/${id}`).then(() => true)),
  checkInSummary: () => attempt(() => client.get('/checkins/summary').then((r) => r.data)),
}

export default client
