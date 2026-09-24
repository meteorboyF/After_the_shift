/**
 * The hours ledger's arithmetic.
 *
 * Bangladesh Labour Act 2006 (s.100, s.102, s.108): a standard week is 48
 * hours, 60 hours at most with overtime, and overtime is paid at twice the
 * ordinary basic hourly rate. Daily limit 8 hours, so every hour past 8 in a
 * shift counts as overtime. Hourly basic = monthly basic ÷ 208 (26 days × 8 h)
 * is the common convention. For information only — not legal advice.
 */
import { daysFrom, SHIFT_HOURS } from './roster.js'
import { startOfDay } from './format.js'

const DAY = 86_400_000
export const STANDARD_WEEK = 48
export const LEGAL_MAX_WEEK = 60
export const DAILY_STANDARD = 8
export const HOURS_PER_MONTH = 208

/** Saturday that starts the week containing `date`. */
export function weekStart(date) {
  const d = startOfDay(date)
  return new Date(d.getTime() - ((d.getDay() + 1) % 7) * DAY)
}

/**
 * One row per day of the week, with the hours the guard actually worked.
 * A running shift counts only what has elapsed; future days count zero.
 */
export function weekRows(anchor, mine, start, now) {
  return daysFrom(anchor, start, 7).map((d) => {
    const worksAs = d.kind === 'REST' && mine.restWorked[d.id] ? 'REST_WORKED' : d.kind
    const scheduled = d.kind === 'DAY' || d.kind === 'NIGHT' || worksAs === 'REST_WORKED'
    let base = 0
    let future = false
    if (scheduled) {
      if (d.start && d.start > now) future = true
      else if (d.start && d.end > now) base = (now - d.start) / 3_600_000
      else if (d.day > now) future = true
      else base = SHIFT_HOURS
    }
    const adj = future ? 0 : (mine.adjust[d.id] ?? 0) / 60
    const hours = Math.max(0, base + adj)
    return { ...d, worksAs, scheduled, future, running: d.start && d.start <= now && d.end > now, hours }
  })
}

export function weekTotal(rows) {
  return rows.reduce((s, r) => s + r.hours, 0)
}

/** Overtime hours this calendar month, day by day, up to now. */
export function monthOvertime(anchor, mine, now) {
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const count = Math.round((startOfDay(now) - first) / DAY) + 1
  const days = daysFrom(anchor, first, count)
  let overtime = 0
  let restDaysWorked = 0
  for (const d of days) {
    const worked = d.kind === 'DAY' || d.kind === 'NIGHT' || (d.kind === 'REST' && mine.restWorked[d.id])
    if (!worked) continue
    if (d.kind === 'REST') restDaysWorked += 1
    let h = SHIFT_HOURS
    if (d.start && d.end > now) h = Math.max(0, (now - d.start) / 3_600_000)
    if (d.start && d.start > now) continue
    h += (mine.adjust[d.id] ?? 0) / 60
    overtime += Math.max(0, h - DAILY_STANDARD)
  }
  return { overtime: Math.round(overtime), restDaysWorked }
}

export function overtimePay(basicPay, overtimeHours) {
  if (!basicPay) return null
  return Math.round((basicPay / HOURS_PER_MONTH) * 2 * overtimeHours)
}
