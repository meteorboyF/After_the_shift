/**
 * Local demo data, used only when there is no backend to adopt history from.
 *
 * The hosted build has no server behind it, and an empty week strip with a
 * "0 requests this month" tally would be the exact screen P7 rejected — the one
 * that shows you nothing for having bothered. The spec's own definition of done
 * requires seed data to make every summary screen non-empty for a demo, so when
 * the backend is unreachable the device seeds itself instead.
 *
 * These mirror backend/demo/DataSeeder so the hosted demo and the local one
 * tell the same story: heaviest hour 9am, a gappy week, five requests with four
 * accepted.
 */

const DAY_MS = 86_400_000

function atHour(daysAgo, hour, minute = 0) {
  const d = new Date(Date.now() - daysAgo * DAY_MS)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

/**
 * Five entries across different hours. 9am recurs, so screen 1D derives
 * "heaviest time — 9 AM" rather than showing nothing.
 *
 * Days 4 and 0 are deliberately skipped: the week strip shows days with
 * entries, not a streak, and a perfect run would quietly imply one.
 */
export function seedCheckIns() {
  return [
    { daysAgo: 1, hour: 9, minute: 12, durationSec: 48, shiftType: 'NIGHT' },
    { daysAgo: 2, hour: 21, minute: 40, durationSec: 63, shiftType: 'DAY' },
    { daysAgo: 3, hour: 9, minute: 5, durationSec: 35, shiftType: 'NIGHT' },
    { daysAgo: 5, hour: 14, minute: 22, durationSec: 52, shiftType: 'DAY' },
    { daysAgo: 6, hour: 9, minute: 51, durationSec: 71, shiftType: 'NIGHT' },
  ].map((s) => ({
    localId: crypto.randomUUID(),
    serverId: null,
    // No audio: these are demo rows, and fabricating a recording of someone
    // speaking would be dishonest in a way an empty playback button is not.
    audioBase64: null,
    mimeType: 'audio/webm',
    transcript: null,
    durationSec: s.durationSec,
    shiftType: s.shiftType,
    recordedAt: atHour(s.daysAgo, s.hour, s.minute),
    demo: true,
  }))
}

/**
 * Five requests inside the current month, four accepted — so the tally on 3D
 * reads "এই মাসে ৫টি অনুরোধ / ৪টি গ্রহণ করা হয়েছে".
 *
 * Dated from the first of the month forward, clamped to today, because the
 * tally counts from the month boundary; "N days ago" would under-report during
 * the first week of a month.
 */
export function seedRelief() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return [
    { dayOfMonth: 2, hour: 14, type: 'SHADE_POST', status: 'ACCEPTED' },
    { dayOfMonth: 6, hour: 11, type: 'REST_HALF_HOUR', status: 'ACCEPTED' },
    { dayOfMonth: 11, hour: 16, type: 'POST_CHANGE', status: 'ACCEPTED' },
    { dayOfMonth: 15, hour: 9, type: 'REST_HALF_HOUR', status: 'ACCEPTED' },
    { dayOfMonth: 18, hour: 13, type: 'SHADE_POST', status: 'PENDING' },
  ].map((s) => {
    const when = new Date(monthStart)
    when.setDate(s.dayOfMonth)
    when.setHours(s.hour, 0, 0, 0)
    if (when > now) when.setTime(now.getTime())

    return {
      localId: crypto.randomUUID(),
      serverId: null,
      type: s.type,
      status: s.status,
      reasonAudioBase64: null,
      reasonTranscript: null,
      createdAt: when.toISOString(),
      demo: true,
    }
  })
}
