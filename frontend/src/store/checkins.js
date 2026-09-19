import { create } from 'zustand'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import { api } from '../lib/api.js'
import { cancelQueued, enqueue, onDelivered } from '../lib/outbox.js'
import { summarise } from '../lib/summary.js'

const STORE_KEY = 'ats-checkins'

/**
 * Check-ins live on the device. IndexedDB is the source of truth — screen 1C
 * tells the guard "ফোনেই থাকবে" (it stays on your phone), so the UI must not
 * depend on a server round trip to show what it just promised to keep.
 *
 * The backend is written to opportunistically and its failure is invisible.
 */
export const useCheckins = create((set, get) => ({
  entries: [],
  loaded: false,

  /** The recording being reviewed on screen 1C. Not yet stored anywhere. */
  pending: null,

  async load() {
    if (get().loaded) return
    const stored = (await idbGet(STORE_KEY)) ?? []
    set({ entries: stored, loaded: true })

    // First run only: adopt whatever the server already holds for this guard,
    // so a fresh device shows the seeded demo history instead of an empty week.
    // Once there is anything local, local wins and the server is never re-read
    // — otherwise a deletion made offline would reappear on the next load.
    if (stored.length > 0) return

    const remote = await api.listCheckIns()
    if (!remote?.length || get().entries.length > 0) return

    const adopted = remote.map((entry) => ({
      localId: crypto.randomUUID(),
      serverId: entry.id,
      audioBase64: entry.audioBase64 ?? null,
      mimeType: 'audio/webm',
      transcript: entry.transcript ?? null,
      durationSec: entry.durationSec,
      shiftType: entry.shiftType,
      recordedAt: entry.recordedAt,
    }))
    set({ entries: adopted })
    await idbSet(STORE_KEY, adopted)
  },

  setPending(pending) {
    set({ pending })
  },

  /** Screen 1C's "মুছে ফেলুন". Nothing was written, so nothing is removed. */
  discardPending() {
    set({ pending: null })
  },

  /** Screen 1C's "রাখুন". Writes locally first, then tells the server. */
  async keepPending() {
    const { pending, entries } = get()
    if (!pending) return null

    const entry = { ...pending, localId: pending.localId ?? crypto.randomUUID(), serverId: null }
    const next = [entry, ...entries]
    set({ entries: next, pending: null })
    await idbSet(STORE_KEY, next)

    // Queued, not awaited. The local write above is what the guard was promised
    // and "রাখা হয়েছে" must appear immediately; the outbox delivers this
    // whenever a connection next exists, including after a reload.
    enqueue(
      'checkin',
      {
        audioBase64: entry.audioBase64 ?? null,
        transcript: entry.transcript ?? null,
        durationSec: Math.round(entry.durationSec),
        shiftType: entry.shiftType,
        recordedAt: entry.recordedAt,
      },
      { localId: entry.localId },
    )

    return entry
  },

  async remove(localId) {
    const target = get().entries.find((e) => e.localId === localId)
    const next = get().entries.filter((e) => e.localId !== localId)
    set({ entries: next })
    await idbSet(STORE_KEY, next)

    // If this entry never synced, cancel its queued create rather than queueing
    // a delete for a server id that does not exist yet.
    const cancelled = await cancelQueued(
      (queued) => queued.kind === 'checkin' && queued.meta?.localId === localId,
    )
    if (cancelled === 0 && target?.serverId) {
      enqueue('deleteCheckin', { id: target.serverId })
    }
  },

  summary() {
    return summarise(get().entries)
  },
}))

/**
 * Record the server id once the outbox delivers a check-in, so a later delete
 * can be mirrored rather than silently staying local.
 */
onDelivered(async (entry, result) => {
  if (entry.kind !== 'checkin' || !result?.id) return
  const { entries } = useCheckins.getState()
  const linked = entries.map((e) =>
    e.localId === entry.meta?.localId ? { ...e, serverId: result.id } : e,
  )
  useCheckins.setState({ entries: linked })
  await idbSet(STORE_KEY, linked)
})
