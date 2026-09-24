/**
 * Numbers, times and durations — in Bangla first.
 *
 * Bangla numerals are rendered here, never hard-coded in strings, so the same
 * sentence works in both languages.
 */
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function num(value, lang = 'bn') {
  const s = String(value)
  return lang === 'bn' ? s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : s
}

/**
 * The part of day, the way a guard says it. 19:00 is "রাত" here, not
 * "সন্ধ্যা": the night shift is spoken of as starting "রাত ৭টা".
 */
export function dayPart(hour) {
  if (hour >= 4 && hour < 6) return 'ভোর'
  if (hour >= 6 && hour < 12) return 'সকাল'
  if (hour >= 12 && hour < 15) return 'দুপুর'
  if (hour >= 15 && hour < 18) return 'বিকেল'
  if (hour === 18) return 'সন্ধ্যা'
  return 'রাত'
}

/** "রাত ৭টা" / "সকাল ৭:৩০" · "7 PM" / "7:30 AM" */
export function clockTime(date, lang = 'bn') {
  const h = date.getHours()
  const m = date.getMinutes()
  if (lang === 'bn') {
    const h12 = h % 12 === 0 ? 12 : h % 12
    const t = m === 0 ? `${num(h12)}টা` : `${num(h12)}:${num(String(m).padStart(2, '0'))}`
    return `${dayPart(h)} ${t}`
  }
  const h12 = h % 12 === 0 ? 12 : h % 12
  const mer = h < 12 ? 'AM' : 'PM'
  return m === 0 ? `${h12} ${mer}` : `${h12}:${String(m).padStart(2, '0')} ${mer}`
}

/** "২ ঘণ্টা ১০ মিনিট" / "2 h 10 min". Rounds up to the minute, never shows seconds. */
export function duration(ms, lang = 'bn') {
  const total = Math.max(0, Math.ceil(ms / 60_000))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (lang === 'bn') {
    if (h === 0) return `${num(m)} মিনিট`
    if (m === 0) return `${num(h)} ঘণ্টা`
    return `${num(h)} ঘণ্টা ${num(m)} মিনিট`
  }
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

const BN_WEEKDAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি']
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function weekday(date, lang = 'bn') {
  return (lang === 'bn' ? BN_WEEKDAYS : EN_WEEKDAYS)[date.getDay()]
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86_400_000)
}

/** "আজ" / "কাল" / "রবিবার" relative to `now`. */
export function relativeDay(date, now, lang = 'bn') {
  const diff = daysBetween(now, date)
  if (lang === 'bn') {
    if (diff === 0) return 'আজ'
    if (diff === 1) return 'কাল'
    if (diff === -1) return 'গতকাল'
    return `${weekday(date, 'bn')}বার`
  }
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return weekday(date, 'en')
}
