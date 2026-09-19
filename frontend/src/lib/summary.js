/**
 * The week strip and the derived line on screen 1D, computed on the device.
 *
 * The backend exposes the same figures at /api/checkins/summary, but the screen
 * reads from local entries so it is correct instantly and stays correct with
 * the backend stopped.
 *
 * Deliberately absent: streaks, completion percentages, and any notion of a
 * missed day. A gap in the strip is just a gap.
 */
export function summarise(entries, now = new Date()) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const today = startOfDay(now)

  const days = new Set()
  const hourCounts = new Map()

  for (const entry of entries) {
    const at = new Date(entry.recordedAt)
    days.add(startOfDay(at))
    const hour = at.getHours()
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1)
  }

  // Seven days ending today, oldest first.
  const week = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    week.push(days.has(today - offset * 86_400_000))
  }

  let heaviestHour = null
  let best = 0
  for (const [hour, count] of hourCounts) {
    // Ties resolve to the earlier hour, so the line does not flip between loads.
    if (count > best || (count === best && heaviestHour !== null && hour < heaviestHour)) {
      best = count
      heaviestHour = hour
    }
  }

  return { week, heaviestHour, totalCount: entries.length }
}
