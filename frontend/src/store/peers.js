import { create } from 'zustand'
import { zoneGet, zoneSet } from '../lib/zones.js'

/**
 * Post swaps — the PEERS zone. Formalises what guards already do informally
 * (P5: "you come to my post, I'll go to yours"; P8: half an hour at another post).
 *
 * An offer is visible only to the named colleague. Only an AGREED swap reaches
 * the supervisor, and only as the post pair and the time — no reason, no history.
 */
const KEY = 'swaps'

export const usePeers = create((set, get) => ({
  loaded: false,
  swaps: [],

  async load() {
    if (get().loaded) return
    const swaps = (await zoneGet('peers', KEY)) ?? []
    set({ swaps, loaded: true })
  },

  async offer(swap) {
    const record = { id: crypto.randomUUID(), status: 'ASKED', createdAt: new Date().toISOString(), ...swap }
    const swaps = [record, ...get().swaps]
    set({ swaps })
    await zoneSet('peers', KEY, swaps)
    return record
  },

  async setStatus(id, status) {
    const swaps = get().swaps.map((s) => (s.id === id ? { ...s, status } : s))
    set({ swaps })
    await zoneSet('peers', KEY, swaps)
    const agreed = swaps.find((s) => s.id === id)
    if (status === 'AGREED' && agreed) {
      // The ONLY thing the supervisor zone receives about a swap.
      const notice = { posts: [agreed.myPost, agreed.theirPost], start: agreed.start, end: agreed.end }
      const list = (await zoneGet('super', 'swaps')) ?? []
      await zoneSet('super', 'swaps', [notice, ...list])
    }
  },
}))
