import axios from 'axios'

/**
 * The backend is optional by design (rule 8). Every call here is best-effort:
 * the UI reads from local storage and never waits on, or fails because of, a
 * request made from this module.
 *
 * On the hosted build there is no backend at all. Rather than let the app fire
 * requests at http://localhost:8080 from an https:// page — which the browser
 * blocks as mixed content and which fills the console with errors on every
 * screen — the base resolves to null and every call short-circuits. Set
 * VITE_API_BASE at build time to point a hosted frontend at a real server.
 */
const API_BASE =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://localhost:8080/api' : null)

/** True when a backend is configured. The outbox checks this before flushing. */
export const isApiConfigured = () => API_BASE !== null

const client = API_BASE
  ? axios.create({
      baseURL: API_BASE,
      timeout: 6000,
      headers: { 'X-Guard-Id': 'demo-guard' },
    })
  : null

/** Resolves to null instead of throwing, so callers need no try/catch. */
async function attempt(request) {
  if (!client) return null
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

  /**
   * Write-only and deliberately guard-less — note there is no matching read.
   * The X-Guard-Id default header is irrelevant here: the endpoint ignores it.
   */
  completeGrounding: (payload) =>
    attempt(() => client.post('/grounding/complete', payload).then(() => true)),

  createRelief: (payload) => attempt(() => client.post('/relief', payload).then((r) => r.data)),
  listRelief: () => attempt(() => client.get('/relief').then((r) => r.data)),
  withdrawRelief: (id) => attempt(() => client.delete(`/relief/${id}`).then(() => true)),
  reliefSummary: () => attempt(() => client.get('/relief/summary').then((r) => r.data)),

  /** Demo route only — proves the wall on stage. Returns four fields per row. */
  supervisorRelief: () => attempt(() => client.get('/supervisor/relief').then((r) => r.data)),
  supervisorSetStatus: (id, status) =>
    attempt(() => client.patch(`/supervisor/relief/${id}`, { status }).then(() => true)),
}

export default client
