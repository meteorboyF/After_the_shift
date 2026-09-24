import { makeAnchor } from './roster.js'

/**
 * First-launch demo data, so no summary screen is ever empty (P7: "I don't get
 * any benefit from it" — an empty tally proves his point).
 */
export function seedSuper(now) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const at = (dayOfMonth, hour) => {
    const d = new Date(monthStart)
    d.setDate(Math.min(dayOfMonth, now.getDate()))
    d.setHours(hour, 0, 0, 0)
    return (d > now ? now : d).toISOString()
  }
  return {
    anchor: makeAnchor(now),
    relief: [
      { id: 'r1', type: 'SHADE_POST', status: 'ACCEPTED', createdAt: at(2, 14) },
      { id: 'r2', type: 'REST_HALF_HOUR', status: 'ACCEPTED', createdAt: at(6, 11) },
      { id: 'r3', type: 'POST_CHANGE', status: 'ACCEPTED', createdAt: at(11, 16) },
      { id: 'r4', type: 'REST_HALF_HOUR', status: 'ACCEPTED', createdAt: at(15, 9) },
      { id: 'r5', type: 'SHADE_POST', status: 'PENDING', createdAt: at(now.getDate(), Math.max(0, now.getHours() - 1)) },
    ],
  }
}
