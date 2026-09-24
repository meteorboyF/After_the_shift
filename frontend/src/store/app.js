import { create } from 'zustand'
import { zoneGet, zoneSet } from '../lib/zones.js'
import { seedSuper } from '../lib/seed.js'
import { useClock } from '../lib/clock.js'
import { toSupervisorRecord } from '../lib/relief.js'

/**
 * App-level state hydrated from the zone databases.
 *
 * Phase 2 carries only what Home needs: the roster anchor and relief requests
 * (supervisor zone). Check-ins, hours corrections, swaps and the rest arrive
 * with their screens in Phase 3–4, each in its own zone.
 */
export const useApp = create((set) => ({
  ready: false,
  anchor: null,
  relief: [],

  async hydrate() {
    let anchor = await zoneGet('super', 'anchor')
    let relief = await zoneGet('super', 'relief')
    if (!anchor || !relief) {
      const seeded = seedSuper(useClock.getState().now())
      anchor = anchor ?? seeded.anchor
      relief = relief ?? seeded.relief
      await zoneSet('super', 'anchor', anchor)
      await zoneSet('super', 'relief', relief)
    }
    set({ anchor, relief, ready: true })
  },

  /** The relief request being composed across 3A → 3B → 3C. Not stored until sent. */
  draft: null,
  setDraft(draft) {
    set({ draft })
  },

  /** 3C "পাঠান": writes exactly the payload the preview rendered. */
  async sendRelief(payload) {
    const record = toSupervisorRecord(payload)
    const relief = [record, ...useApp.getState().relief]
    set({ relief, draft: null })
    await zoneSet('super', 'relief', relief)
    return record
  },

  /** Only a pending request can be withdrawn. It stays in history, marked. */
  async withdrawRelief(id) {
    const relief = useApp
      .getState()
      .relief.map((r) => (r.id === id && r.status === 'PENDING' ? { ...r, status: 'WITHDRAWN' } : r))
    set({ relief })
    await zoneSet('super', 'relief', relief)
  },
}))

const LANG_KEY = 'ats-lang'
function readLang() {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'bn'
  } catch {
    return 'bn'
  }
}

/** Bangla is primary; English is a secondary toggle. Stored on-device only. */
export const useLang = create((set, get) => ({
  lang: readLang(),
  toggle() {
    const lang = get().lang === 'bn' ? 'en' : 'bn'
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* fine */
    }
    document.documentElement.lang = lang
    set({ lang })
  },
}))
