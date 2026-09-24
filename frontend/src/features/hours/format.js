import { num } from '../../lib/format.js'

/** 11.5 → "১১ ঘণ্টা ৩০ মিনিট" / "11 h 30 min" */
export function hoursText(x, t, lang) {
  const total = Math.round(x * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? t('hours.h', { n: h }) : t('hours.hm', { h: num(h, lang), m: num(m, lang) })
}

export function taka(n, lang) {
  return num(new Intl.NumberFormat('en-IN').format(n), lang)
}
