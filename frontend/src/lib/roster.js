/**
 * The roster engine.
 *
 * Research basis: guards work 12-hour shifts, rotate weekly between day and
 * night, and have no choice in allocation (P1–P8; Daily Star; Teynampet study).
 *
 * The roster belongs to the SUPERVISOR zone — it arrives from the office and is
 * read-only on the phone. It is generated deterministically from an anchor that
 * is fixed on first launch, so the demo always opens mid-shift with a rotation
 * three days away (the state that shows the most of the design), and stays
 * consistent for the rest of the session.
 */
import { startOfDay } from './format.js'

export const DAY_START = 7 // 07:00 – 19:00
export const NIGHT_START = 19 // 19:00 – 07:00
export const SHIFT_HOURS = 12
const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000

/** Six shifts, then the weekly rest day, then the rotation flips. */
const BLOCK = ['W', 'W', 'W', 'W', 'W', 'W', 'R']

export const POSTS = {
  'gate-1': { bn: 'গেট ১', en: 'Gate 1' },
  'gate-2': { bn: 'গেট ২', en: 'Gate 2' },
  'gate-3': { bn: 'গেট ৩', en: 'Gate 3' },
  'gate-5': { bn: 'গেট ৫', en: 'Gate 5' },
  library: { bn: 'লাইব্রেরি', en: 'Library' },
}

export const MY_POST = 'gate-2'

/** Colleagues on the posts either side of mine, by shift kind. Names only — no photos. */
export const NEIGHBOURS = {
  DAY: [
    { post: 'gate-1', bn: 'করিম ভাই', en: 'Karim' },
    { post: 'gate-3', bn: 'সেলিম ভাই', en: 'Selim' },
    { post: 'library', bn: 'হাবিব ভাই', en: 'Habib' },
  ],
  NIGHT: [
    { post: 'gate-1', bn: 'মনির ভাই', en: 'Monir' },
    { post: 'gate-3', bn: 'রফিক ভাই', en: 'Rafiq' },
    { post: 'gate-5', bn: 'জসিম ভাই', en: 'Jasim' },
  ],
}

/**
 * Make an anchor from the moment of first launch: the current block started
 * four days ago, so the rotation flips three days from now, and its kind is
 * whichever puts the guard on duty right now.
 */
export function makeAnchor(now) {
  const h = now.getHours()
  const onDay = h >= DAY_START && h < NIGHT_START
  // Before 07:00 the running night shift started yesterday.
  const shiftDay = startOfDay(new Date(now.getTime() - (h < DAY_START ? DAY_MS : 0)))
  return {
    blockStart: new Date(shiftDay.getTime() - 4 * DAY_MS).toISOString(),
    firstKind: onDay ? 'DAY' : 'NIGHT',
    // Approved home leave, 18 days out (P7 takes banked rest days in one block).
    leaveStart: new Date(shiftDay.getTime() + 18 * DAY_MS).toISOString(),
    leaveDays: 5,
  }
}

function dayIndex(anchor, date) {
  return Math.round((startOfDay(date) - startOfDay(new Date(anchor.blockStart))) / DAY_MS)
}

/** The roster entry for one calendar day. */
export function shiftForDay(anchor, date) {
  const day = startOfDay(date)
  const idx = dayIndex(anchor, day)
  const leaveStart = startOfDay(new Date(anchor.leaveStart))
  const leaveIdx = Math.round((day - leaveStart) / DAY_MS)
  const id = day.toISOString().slice(0, 10)

  if (leaveIdx >= 0 && leaveIdx < anchor.leaveDays) {
    return { id, day, kind: 'LEAVE', post: null, start: null, end: null }
  }

  const blockNo = Math.floor(idx / BLOCK.length)
  const pos = ((idx % BLOCK.length) + BLOCK.length) % BLOCK.length
  const flip = ((blockNo % 2) + 2) % 2 === 1
  const kind = flip ? (anchor.firstKind === 'DAY' ? 'NIGHT' : 'DAY') : anchor.firstKind

  if (BLOCK[pos] === 'R') return { id, day, kind: 'REST', post: null, start: null, end: null }

  const startHour = kind === 'DAY' ? DAY_START : NIGHT_START
  const start = new Date(day)
  start.setHours(startHour, 0, 0, 0)
  const end = new Date(start.getTime() + SHIFT_HOURS * HOUR_MS)
  return { id, day, kind, post: MY_POST, start, end }
}

export function daysFrom(anchor, from, count) {
  const out = []
  for (let i = 0; i < count; i += 1) {
    out.push(shiftForDay(anchor, new Date(startOfDay(from).getTime() + i * DAY_MS)))
  }
  return out
}

const isWork = (s) => s.kind === 'DAY' || s.kind === 'NIGHT'

/** Working shifts overlapping a window, oldest first. */
function workAround(anchor, now, back = 8, ahead = 30) {
  return daysFrom(anchor, new Date(now.getTime() - back * DAY_MS), back + ahead).filter(isWork)
}

/**
 * Everything the home screen needs to know about "now".
 *
 * phase:
 *   'on'        — on duty, more than an hour left
 *   'lastHour'  — on duty, final hour: the check-in rises
 *   'justEnded' — within an hour after a shift ended: the check-in stays up
 *   'off'       — off duty; shows when the next shift starts
 */
export function shiftState(anchor, now) {
  const t = now.getTime()
  const work = workAround(anchor, now)
  const current = work.find((s) => s.start <= t && t < s.end) ?? null
  const previous = [...work].reverse().find((s) => s.end <= t) ?? null
  const next = work.find((s) => s.start > t) ?? null

  let phase = 'off'
  let focus = next
  if (current) {
    focus = current
    phase = current.end - t <= HOUR_MS ? 'lastHour' : 'on'
  } else if (previous && t - previous.end < HOUR_MS) {
    focus = previous
    phase = 'justEnded'
  }

  const progress = current ? (t - current.start) / (current.end - current.start) : phase === 'justEnded' ? 1 : 0

  return {
    phase,
    focus,
    current,
    previous,
    next,
    progress,
    remainingMs: current ? current.end - t : 0,
    untilStartMs: next ? next.start - t : 0,
    sinceEndMs: previous ? t - previous.end : 0,
    rotation: nextRotation(anchor, now, current ?? previous ?? next),
  }
}

/** The next day/night switch, if one is coming. */
export function nextRotation(anchor, now, reference) {
  if (!reference) return null
  const ahead = daysFrom(anchor, now, 21).filter(isWork)
  const flip = ahead.find((s) => s.kind !== reference.kind && s.start > now)
  if (!flip) return null
  const daysAway = Math.round((startOfDay(flip.start) - startOfDay(now)) / DAY_MS)
  return { kind: flip.kind, start: flip.start, daysAway }
}

/**
 * Hours actually worked since the start of the week. The Bangladeshi work week
 * starts on Saturday. Counts the running shift up to now.
 */
export function hoursThisWeek(anchor, now) {
  const weekStart = startOfDay(new Date(now.getTime() - ((now.getDay() + 1) % 7) * DAY_MS))
  const shifts = workAround(anchor, now, 9, 1).filter((s) => s.start >= weekStart && s.start < now)
  const ms = shifts.reduce((sum, s) => sum + (Math.min(s.end, now) - s.start), 0)
  return Math.round(ms / HOUR_MS)
}

/** Days until the next approved leave block starts. */
export function daysUntilLeave(anchor, now) {
  return Math.round((startOfDay(new Date(anchor.leaveStart)) - startOfDay(now)) / DAY_MS)
}
