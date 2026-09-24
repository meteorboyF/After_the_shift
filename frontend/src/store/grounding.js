import { zoneGet, zoneSet } from '../lib/zones.js'

/**
 * Task 2 persists NOTHING about the guard: no timestamp, no duration, no link
 * to a person. Only an anonymous count per exercise, so "এটা কোথাও লেখা হয়নি"
 * (this was not recorded anywhere) stays literally true about the session.
 */
export async function countGrounding(type) {
  const counts = (await zoneGet('mine', 'grounding-count')) ?? {}
  counts[type] = (counts[type] ?? 0) + 1
  await zoneSet('mine', 'grounding-count', counts)
}
