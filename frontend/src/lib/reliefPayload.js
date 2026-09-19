/**
 * One payload, two readers.
 *
 * Screen 3C promises "সুপারভাইজার এটাই দেখবেন" — your supervisor will see only
 * this. For that to be true rather than merely claimed, the preview must be
 * rendered from the very object that gets POSTed, narrowed by the very same
 * function the server's supervisor projection mirrors.
 *
 * So: buildReliefPayload() makes the request, supervisorViewOf() narrows it,
 * and 3C renders the narrowed result. There is no second, hand-written
 * "example" of what a supervisor sees that could quietly fall out of step.
 */

export const RELIEF_TYPES = ['REST_HALF_HOUR', 'POST_CHANGE', 'SHADE_POST']

/** UI key → API enum. Keeps the route param readable without a second list. */
export const RELIEF_KEYS = {
  rest: 'REST_HALF_HOUR',
  swap: 'POST_CHANGE',
  shade: 'SHADE_POST',
}

export function buildReliefPayload({ type, reasonAudioBase64 = null, reasonTranscript = null }) {
  return {
    type,
    reasonAudioBase64,
    reasonTranscript,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Exactly the four fields com.aftertheshift.supervisor.ReliefCard exposes.
 * If that record ever changes, this is the one place the UI follows it.
 */
export function supervisorViewOf(payload, { id = null, status = 'PENDING' } = {}) {
  return {
    id,
    type: payload.type,
    createdAt: payload.createdAt,
    status,
  }
}

/**
 * What is deliberately withheld, named so screen 3C can draw it struck through.
 * These are the three things a guard would most fear being read.
 */
export const WITHHELD_FROM_SUPERVISOR = ['checkins', 'recordings', 'exercises']
