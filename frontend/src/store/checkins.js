import { create } from 'zustand'
import { zoneGet, zoneSet } from '../lib/zones.js'
import { useClock } from '../lib/clock.js'
import { startOfDay } from '../lib/format.js'

/**
 * Task 1 check-ins. MINE zone only: this data never leaves the phone and there
 * is no code path that copies it to another zone.
 *
 * Audio is stored as a Blob straight in IndexedDB.
 */
const KEY = 'checkins'
const DAY = 86_400_000

/** Demo history: a few entries from the past week, recorded just after shifts. No fake audio. */
function seed(now) {
  const at = (daysAgo, h, m, kind, dur) => {
    const d = new Date(startOfDay(now).getTime() - daysAgo * DAY)
    d.setHours(h, m, 0, 0)
    return { id: `seed-${daysAgo}`, recordedAt: d.toISOString(), durationSec: dur, shiftKind: kind, audio: null, transcript: null, demo: true }
  }
  return [at(1, 19, 22, 'DAY', 48), at(2, 19, 41, 'DAY', 63), at(4, 7, 18, 'NIGHT', 35), at(6, 7, 9, 'NIGHT', 71)]
}

export const useCheckins = create((set, get) => ({
  loaded: false,
  entries: [],
  /** The recording under review on 1C. Not stored anywhere yet. */
  pending: null,
  /** Last deletion, for the 5-second undo. */
  lastRemoved: null,

  async load() {
    if (get().loaded) return
    let entries = await zoneGet('mine', KEY)
    if (!entries) {
      entries = seed(useClock.getState().now())
      await zoneSet('mine', KEY, entries)
    }
    set({ entries, loaded: true })
  },

  setPending(pending) {
    set({ pending })
  },
  discardPending() {
    set({ pending: null })
  },

  async keepPending() {
    const { pending, entries } = get()
    if (!pending) return null
    const entry = { ...pending, id: crypto.randomUUID(), demo: false }
    const next = [entry, ...entries]
    set({ entries: next, pending: null })
    await zoneSet('mine', KEY, next)
    return entry
  },

  async remove(id) {
    const entries = get().entries
    const index = entries.findIndex((e) => e.id === id)
    if (index < 0) return
    const next = entries.filter((e) => e.id !== id)
    set({ entries: next, lastRemoved: { entry: entries[index], index } })
    await zoneSet('mine', KEY, next)
  },

  async undoRemove() {
    const { lastRemoved, entries } = get()
    if (!lastRemoved) return
    const next = [...entries]
    next.splice(lastRemoved.index, 0, lastRemoved.entry)
    set({ entries: next, lastRemoved: null })
    await zoneSet('mine', KEY, next)
  },

  clearUndo() {
    set({ lastRemoved: null })
  },
}))

/**
 * The visible result on 1D. Deliberately absent: streaks, percentages, "missed"
 * days. Counts are split by the shift the entry followed — that is true and
 * useful, unlike "heaviest time", which only measured when he spoke (audit C4).
 */
export function weekSummary(entries, now) {
  const today = startOfDay(now).getTime()
  const days = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = today - i * DAY
    days.push({ date: new Date(d), filled: entries.some((e) => startOfDay(new Date(e.recordedAt)).getTime() === d), today: i === 0 })
  }
  const inWeek = entries.filter((e) => new Date(e.recordedAt).getTime() >= today - 6 * DAY)
  return {
    days,
    total: inWeek.length,
    afterNight: inWeek.filter((e) => e.shiftKind === 'NIGHT').length,
    afterDay: inWeek.filter((e) => e.shiftKind === 'DAY').length,
  }
}
