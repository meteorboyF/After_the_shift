import { toBanglaDigits } from './format.js'

/**
 * Bangla names the part of the day before the hour — "সকাল ৯টা", not "৯:০০".
 * Saying it the other way round reads like a translation, which rule 6 rules
 * out.
 */
function banglaDayPart(hour) {
  if (hour < 4) return 'রাত'
  if (hour < 6) return 'ভোর'
  if (hour < 12) return 'সকাল'
  if (hour < 15) return 'দুপুর'
  if (hour < 18) return 'বিকেল'
  if (hour < 20) return 'সন্ধ্যা'
  return 'রাত'
}

function to12Hour(hour) {
  const h = hour % 12
  return h === 0 ? 12 : h
}

/** 9 → "সকাল ৯টা" / "9 AM" */
export function formatHour(hour, lang) {
  if (hour == null) return ''
  if (lang === 'bn') {
    return `${banglaDayPart(hour)} ${toBanglaDigits(to12Hour(hour))}টা`
  }
  return `${to12Hour(hour)} ${hour < 12 ? 'AM' : 'PM'}`
}

/** Relative day, for the past-entries list. Never a streak, never a count. */
export function formatDay(isoString, lang) {
  const date = new Date(isoString)
  const today = new Date()
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const daysAgo = Math.round((startOf(today) - startOf(date)) / 86_400_000)

  if (lang === 'bn') {
    if (daysAgo === 0) return 'আজ'
    if (daysAgo === 1) return 'গতকাল'
    return `${toBanglaDigits(daysAgo)} দিন আগে`
  }
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  return `${daysAgo} days ago`
}

/** "আজ, দুপুর ১টা" — used on the supervisor preview card. */
export function formatDateTime(isoString, lang) {
  const date = new Date(isoString)
  return `${formatDay(isoString, lang)}, ${formatHour(date.getHours(), lang)}`
}

/** "এইমাত্র" / "৫ মিনিট আগে" / "২ ঘণ্টা আগে" — relative age on screen 3D. */
export function relativeAge(isoString, t) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 60_000))
  if (minutes < 1) return t('relief.justNow')
  if (minutes < 60) return t('relief.minutesAgo', { n: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('relief.hoursAgo', { n: hours })
  return null
}

/** Guards work two 12-hour shifts; 18:00–05:59 is the night one. */
export function shiftTypeForNow(date = new Date()) {
  const h = date.getHours()
  return h >= 18 || h < 6 ? 'NIGHT' : 'DAY'
}
