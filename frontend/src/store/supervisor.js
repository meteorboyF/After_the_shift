import { create } from 'zustand'
import { api } from '../lib/api.js'

/**
 * Demo-only store for the supervisor route.
 *
 * It holds relief cards and nothing else — there is no check-in or grounding
 * state reachable from here, mirroring the backend package boundary. Unlike the
 * guard-facing stores there is no IndexedDB persistence: a supervisor view has
 * no business caching a guard's requests on the device.
 */
export const useSupervisor = create((set) => ({
  rows: [],
  loaded: false,

  async refresh() {
    const rows = await api.supervisorRelief()
    set({ rows: rows ?? [], loaded: true })
  },

  async accept(id) {
    await api.supervisorSetStatus(id, 'ACCEPTED')
    const rows = await api.supervisorRelief()
    set({ rows: rows ?? [], loaded: true })
  },
}))
