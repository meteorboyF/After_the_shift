import { create } from 'zustand'
import { get as idbGet, set as idbSet } from 'idb-keyval'
import { api } from '../lib/api.js'
import { cancelQueued, enqueue, onDelivered } from '../lib/outbox.js'
import { seedRelief } from '../lib/demoSeed.js'

const STORE_KEY = 'ats-relief'

/** This month, counted locally so the tally is right with the backend down. */
export function summariseRelief(requests, now = new Date()) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const thisMonth = requests.filter((r) => new Date(r.createdAt).getTime() >= monthStart)
  return {
    monthCount: thisMonth.length,
    acceptedCount: thisMonth.filter((r) => r.status === 'ACCEPTED').length,
  }
}

/**
 * Relief requests, local-first like check-ins.
 *
 * The spoken reason is stored here alongside the request. It is sent to the
 * server — which needs it, because a supervisor may later be shown a reason the
 * guard chose to attach — but it is never part of what /api/supervisor/relief
 * returns. See ReliefCard.
 */
export const useRelief = create((set, get) => ({
  requests: [],
  loaded: false,

  /** The request being composed across 3A → 3B → 3C. */
  draft: null,

  async load() {
    if (get().loaded) return
    const stored = (await idbGet(STORE_KEY)) ?? []
    set({ requests: stored, loaded: true })

    // First run only, same rule as check-ins: adopt the server's history so the
    // tally is populated for a demo, then let local win from then on.
    if (stored.length > 0) return
    const remote = await api.listRelief()
    if (get().requests.length > 0) return

    // Same reasoning as check-ins: the tally is the answer to P7, and an empty
    // one on a hosted demo would make his point rather than the counter-point.
    if (!remote?.length) {
      const seeded = seedRelief()
      set({ requests: seeded })
      await idbSet(STORE_KEY, seeded)
      return
    }

    const adopted = remote.map((r) => ({
      localId: crypto.randomUUID(),
      serverId: r.id,
      type: r.type,
      status: r.status,
      reasonAudioBase64: r.reasonAudioBase64 ?? null,
      reasonTranscript: r.reasonTranscript ?? null,
      createdAt: r.createdAt,
    }))
    set({ requests: adopted })
    await idbSet(STORE_KEY, adopted)
  },

  setDraft(draft) {
    set({ draft })
  },

  clearDraft() {
    set({ draft: null })
  },

  /**
   * Screen 3C's "পাঠান". Takes the exact payload the preview was rendered from,
   * so what was shown and what is sent cannot differ.
   */
  async send(payload) {
    const request = {
      localId: crypto.randomUUID(),
      serverId: null,
      type: payload.type,
      status: 'PENDING',
      reasonAudioBase64: payload.reasonAudioBase64 ?? null,
      reasonTranscript: payload.reasonTranscript ?? null,
      createdAt: payload.createdAt,
    }

    const next = [request, ...get().requests]
    set({ requests: next, draft: null })
    await idbSet(STORE_KEY, next)

    // Queued, not awaited — the status screen must appear immediately, and the
    // request still reaches the supervisor once a connection exists.
    enqueue('relief', payload, { localId: request.localId })

    return request
  },

  /** Withdrawing. Asking was never irreversible. */
  async withdraw(localId) {
    const target = get().requests.find((r) => r.localId === localId)
    const next = get().requests.filter((r) => r.localId !== localId)
    set({ requests: next })
    await idbSet(STORE_KEY, next)

    // Withdrawing something that never synced cancels its pending send, so a
    // request the guard took back is never delivered late.
    const cancelled = await cancelQueued(
      (queued) => queued.kind === 'relief' && queued.meta?.localId === localId,
    )
    if (cancelled === 0 && target?.serverId) {
      enqueue('withdrawRelief', { id: target.serverId })
    }
  },

  /** Pulls statuses a supervisor may have changed since last time. */
  async refreshStatuses() {
    const remote = await api.listRelief()
    if (!remote) return
    const byServerId = new Map(remote.map((r) => [r.id, r.status]))
    const next = get().requests.map((r) =>
      r.serverId && byServerId.has(r.serverId)
        ? { ...r, status: byServerId.get(r.serverId) }
        : r,
    )
    set({ requests: next })
    await idbSet(STORE_KEY, next)
  },
}))

/** Link the server id once a queued request is actually delivered. */
onDelivered(async (entry, result) => {
  if (entry.kind !== 'relief' || !result?.id) return
  const { requests } = useRelief.getState()
  const linked = requests.map((r) =>
    r.localId === entry.meta?.localId ? { ...r, serverId: result.id } : r,
  )
  useRelief.setState({ requests: linked })
  await idbSet(STORE_KEY, linked)
})
