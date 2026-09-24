/**
 * Task 3's payload — the ONE object that is both rendered on the preview (3C)
 * and written to the supervisor zone on send. Because it is the same object,
 * what the guard is shown cannot drift from what the supervisor receives
 * (audit B4 / O5).
 *
 * Contents are deliberately tiny: what is needed, when it was asked, and — only
 * if the guard chose to attach one — his spoken reason. Nothing from the MINE
 * zone can appear here: there is no field for it.
 */
export const RELIEF_TYPES = {
  REST_HALF_HOUR: { key: 'rest', icon: 'Clock' },
  POST_CHANGE: { key: 'change', icon: 'ArrowLeftRight' },
  SHADE_POST: { key: 'shade', icon: 'Umbrella' },
}

export function buildPayload({ type, reason = null, now }) {
  return Object.freeze({
    type,
    createdAt: now.toISOString(),
    reason: reason ? Object.freeze({ audio: reason.audio, durationSec: reason.durationSec }) : null,
  })
}

/** What the supervisor zone stores. Identical fields to the payload, plus status. */
export function toSupervisorRecord(payload) {
  return { id: crypto.randomUUID(), status: 'PENDING', ...payload }
}

export function monthTally(requests, now) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const month = requests.filter((r) => r.status !== 'WITHDRAWN' && new Date(r.createdAt).getTime() >= start)
  return { asked: month.length, accepted: month.filter((r) => r.status === 'ACCEPTED').length }
}
