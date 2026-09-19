/**
 * Guard photograph manifest.
 *
 * These images reflect the app's *context*, never the user's emotion. The user
 * never picks one, they are never shown as a grid, and they are never labelled
 * with a feeling. Selection is deterministic and derived from where you are in
 * the app and what time it is — see pickGuardImage() below.
 *
 * Files live in public/images/guards/ and are named by semantic key, so adding
 * a photo means dropping it in and appending the filename here.
 */

const MANIFEST = {
  night_post: [
    'night_post_01.jpg', 'night_post_02.jpg', 'night_post_03.jpg',
    'night_post_04.jpg', 'night_post_05.jpg', 'night_post_06.jpg',
    'night_post_07.jpg', 'night_post_08.jpg', 'night_post_09.jpg',
    'night_post_10.jpg', 'night_post_11.jpg',
  ],
  day_post: ['day_post_01.jpg', 'day_post_02.jpg', 'day_post_03.jpg'],
  walking: [
    'walking_01.jpg', 'walking_02.jpg', 'walking_03.jpg', 'walking_04.jpg',
    'walking_05.jpg', 'walking_06.jpg', 'walking_07.jpg', 'walking_08.jpg',
    'walking_09.jpg',
  ],
  after_incident: ['after_incident_01.jpg'],
  resting: ['resting_01.jpg'],
  shift_end: ['shift_end_01.jpg'],
  greeting: ['greeting_01.jpg'],
  relief_granted: ['relief_granted_01.jpg', 'relief_granted_02.jpg'],
}

export const GUARD_KEYS = Object.keys(MANIFEST)

/** Night runs 18:00–05:59. Matches the 12-hour shift split our participants work. */
export function isNightHour(date = new Date()) {
  const h = date.getHours()
  return h >= 18 || h < 6
}

/** The home screen's backdrop follows the clock, not the person. */
export function homeKey(date = new Date()) {
  return isNightHour(date) ? 'night_post' : 'day_post'
}

/**
 * Deterministic pick within a key. `seed` keeps one screen showing one photo for
 * as long as you are on it, instead of reshuffling on every re-render.
 */
export function pickGuardImage(key, seed = 0) {
  const files = MANIFEST[key]
  if (!files || files.length === 0) return null
  const index = Math.abs(Math.trunc(seed)) % files.length
  return `/images/guards/${files[index]}`
}

export default MANIFEST
