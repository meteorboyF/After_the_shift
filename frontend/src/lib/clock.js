import { create } from 'zustand'

/**
 * One clock for the whole app.
 *
 * The home screen changes with the shift (the check-in becomes prominent in the
 * last hour and the first hour after), so a presenter needs to move time without
 * waiting twelve hours. `offsetMs` shifts "now"; it lives in sessionStorage so a
 * presenter's scrub never survives into a real guard's next session.
 *
 * `?at=HH:MM` in the URL hash sets the offset so that the local time reads HH:MM
 * — handy for linking straight to a state from DEMO.md.
 */
const KEY = 'ats-clock-offset'

function readOffset() {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0
  } catch {
    return 0
  }
}

export const useClock = create((set, get) => ({
  offsetMs: readOffset(),
  tick: Date.now(),

  now() {
    return new Date(get().tick + get().offsetMs)
  },

  setOffset(offsetMs) {
    try {
      sessionStorage.setItem(KEY, String(offsetMs))
    } catch {
      /* private mode: the scrub just won't persist */
    }
    set({ offsetMs, tick: Date.now() })
  },

  /** Jump so the wall clock reads hour:minute today. */
  setTimeOfDay(hour, minute = 0) {
    const real = new Date()
    const target = new Date(real)
    target.setHours(hour, minute, 0, 0)
    get().setOffset(target.getTime() - real.getTime())
  },

  reset() {
    get().setOffset(0)
  },
}))

let started = false
/** Re-render clock consumers every 20s — countdowns are in minutes. */
export function startClock() {
  if (started) return
  started = true
  setInterval(() => useClock.setState({ tick: Date.now() }), 20_000)

  const applyAt = () => {
    const match = window.location.hash.match(/[?&]at=(\d{1,2}):(\d{2})/)
    if (match) useClock.getState().setTimeOfDay(Number(match[1]), Number(match[2]))
  }
  applyAt()
  window.addEventListener('hashchange', applyAt)
}

/** Subscribe to the clock and get the current (possibly offset) Date. */
export function useNow() {
  const tick = useClock((s) => s.tick)
  const offsetMs = useClock((s) => s.offsetMs)
  return new Date(tick + offsetMs)
}
