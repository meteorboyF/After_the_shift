/**
 * Short vibrations only, and never as a nudge — the app does not initiate
 * contact. These fire strictly in response to something the guard just did,
 * which matters when the phone is in a pocket during the grounding exercise.
 */
const can = () => typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

export function tapFeedback() {
  if (can()) navigator.vibrate(12)
}

export function confirmFeedback() {
  if (can()) navigator.vibrate([10, 55, 18])
}

/** Breath cues, so the exercise works with the screen off. */
export function breathIn() {
  if (can()) navigator.vibrate(24)
}

export function breathOut() {
  if (can()) navigator.vibrate([14, 40, 14])
}
