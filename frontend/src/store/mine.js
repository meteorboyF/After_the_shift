import { create } from 'zustand'
import { zoneGet, zoneSet } from '../lib/zones.js'
import { useClock } from '../lib/clock.js'
import { daysFrom } from '../lib/roster.js'
import { startOfDay } from '../lib/format.js'

/**
 * MINE-zone practical data: the hours ledger and the water tally.
 * On-device only, never synced, no account.
 *
 *   adjust     — { 'YYYY-MM-DD': minutes } corrections the guard tapped in (±30)
 *   restWorked — { 'YYYY-MM-DD': true } rest days he worked instead of taking
 *   basicPay   — monthly basic wage, entered once by stepper, or null
 *   water      — { shiftId: glasses } for the current shift only matters
 */
const KEY = 'ledger'

function seed(anchor, now) {
  // Research: rest days are routinely worked (Daily Star). Mark last week's.
  const restWorked = {}
  const past = daysFrom(anchor, new Date(startOfDay(now).getTime() - 10 * 86_400_000), 10)
  const lastRest = [...past].reverse().find((d) => d.kind === 'REST')
  if (lastRest) restWorked[lastRest.id] = true
  const adjust = {}
  const lastWork = [...past].reverse().find((d) => d.kind === 'DAY' || d.kind === 'NIGHT')
  if (lastWork) adjust[lastWork.id] = 60 // relief arrived an hour late
  return { adjust, restWorked, basicPay: null, water: {} }
}

export const useMine = create((set, get) => ({
  loaded: false,
  adjust: {},
  restWorked: {},
  basicPay: null,
  water: {},

  async load(anchor) {
    if (get().loaded || !anchor) return
    let data = await zoneGet('mine', KEY)
    if (!data) {
      data = seed(anchor, useClock.getState().now())
      await zoneSet('mine', KEY, data)
    }
    set({ ...data, loaded: true })
  },

  async save(patch) {
    set(patch)
    const { adjust, restWorked, basicPay, water } = get()
    await zoneSet('mine', KEY, { adjust, restWorked, basicPay, water })
  },

  nudge(dayId, minutes) {
    const cur = get().adjust[dayId] ?? 0
    const next = Math.max(-12 * 60, Math.min(12 * 60, cur + minutes))
    return get().save({ adjust: { ...get().adjust, [dayId]: next } })
  },

  toggleRestWorked(dayId) {
    const restWorked = { ...get().restWorked }
    if (restWorked[dayId]) delete restWorked[dayId]
    else restWorked[dayId] = true
    return get().save({ restWorked })
  },

  setBasicPay(basicPay) {
    return get().save({ basicPay })
  },

  addWater(shiftId, delta) {
    const cur = get().water[shiftId] ?? 0
    return get().save({ water: { ...get().water, [shiftId]: Math.max(0, Math.min(12, cur + delta)) } })
  },
}))
