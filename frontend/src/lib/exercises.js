/**
 * The three options on screen 2B.
 *
 * Water on the face, slow breathing, a short walk — these came out of the
 * interviews as what guards already do. Coping here is physical and passive,
 * not verbal, so nothing in this file asks anyone to reflect, journal or rate.
 */

/**
 * The breathing cycle. This timing *is* the exercise — a longer exhale than
 * inhale is what settles the nervous system, so these numbers are not styling
 * and must not be rounded for convenience.
 */
export const BREATH = {
  inhaleSec: 4,
  holdSec: 2,
  exhaleSec: 6,
}

export const BREATH_CYCLE_SEC = BREATH.inhaleSec + BREATH.holdSec + BREATH.exhaleSec // 12

/** Where in the 12s cycle a given elapsed time falls. */
export function breathPhaseAt(elapsedSec) {
  const t = elapsedSec % BREATH_CYCLE_SEC
  if (t < BREATH.inhaleSec) return 'in'
  if (t < BREATH.inhaleSec + BREATH.holdSec) return 'hold'
  return 'out'
}

export const EXERCISES = {
  water: {
    key: 'water',
    icon: 'water',
    durationSec: 60,
    minutes: 1,
    guard: 'after_incident',
    /** Spoken once at the start, so it works with the phone in a pocket. */
    cueKey: 'grounding.waterCue',
  },
  breathing: {
    key: 'breathing',
    icon: 'breathe',
    durationSec: 120,
    minutes: 2,
    guard: 'night_post',
    cueKey: 'grounding.breathingCue',
  },
  walk: {
    key: 'walk',
    icon: 'walk',
    durationSec: 180,
    minutes: 3,
    guard: 'walking',
    cueKey: 'grounding.walkCue',
  },
}

export const EXERCISE_ORDER = ['water', 'breathing', 'walk']

/** Maps a UI key to the backend enum. */
export function toExerciseType(key) {
  return key.toUpperCase()
}
