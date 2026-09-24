/**
 * Offline temperature: the month's typical Dhaka range (°C, approx. climate
 * normals). No network needed, and labelled as "usual for <month>" so it never
 * pretends to be a live forecast.
 */
const DHAKA = [
  [13, 25], [16, 28], [20, 32], [23, 34], [25, 34], [26, 32],
  [26, 31], [26, 32], [26, 32], [24, 31], [19, 29], [14, 26],
]

export function typicalRange(date) {
  const [min, max] = DHAKA[date.getMonth()]
  return { min, max, hot: max >= 30 }
}

export function monthName(date, lang) {
  return date.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB', { month: 'long' })
}
