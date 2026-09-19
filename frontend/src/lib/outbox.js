import { get as idbGet, set as idbSet } from 'idb-keyval'
import { api, isApiConfigured } from './api.js'

const QUEUE_KEY = 'ats-outbox'

/**
 * A durable outbox for writes the server has not accepted yet.
 *
 * Rule 8 says assume no connectivity. Until now every write was fired at the
 * API and forgotten, which is fine for the guard — local storage is the source
 * of truth — but means a check-in made on a campus with no signal never reaches
 * the backend at all. The queue survives a reload and drains when a connection
 * appears.
 *
 * Nothing in the UI ever waits on this, and a failure here is never surfaced as
 * an error. The guard was told their entry stays on the phone; whether it also
 * reached a server is not their problem to manage.
 */

const SENDERS = {
  checkin: (payload) => api.createCheckIn(payload),
  deleteCheckin: ({ id }) => api.deleteCheckIn(id),
  relief: (payload) => api.createRelief(payload),
  withdrawRelief: ({ id }) => api.withdrawRelief(id),
  grounding: (payload) => api.completeGrounding(payload),
}

let listeners = []
let flushing = false

/**
 * Notified when an entry is accepted, so a store can record the server id it
 * got back. Returns an unsubscribe function.
 */
export function onDelivered(listener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

async function readQueue() {
  return (await idbGet(QUEUE_KEY)) ?? []
}

async function writeQueue(queue) {
  await idbSet(QUEUE_KEY, queue)
}

export async function enqueue(kind, payload, meta = {}) {
  const queue = await readQueue()
  queue.push({ id: crypto.randomUUID(), kind, payload, meta })
  await writeQueue(queue)
  flush()
}

/**
 * Drop queued entries matching a predicate.
 *
 * Needed because deleting something that has not synced yet must also cancel
 * its pending create — otherwise the entry would be deleted locally and then
 * helpfully resurrected on the server the next time a connection appeared.
 */
export async function cancelQueued(predicate) {
  const queue = await readQueue()
  const kept = queue.filter((entry) => !predicate(entry))
  if (kept.length !== queue.length) await writeQueue(kept)
  return queue.length - kept.length
}

export async function pendingCount() {
  return (await readQueue()).length
}

/**
 * Try to deliver everything, oldest first, stopping at the first failure so
 * ordering is preserved — a delete must not overtake the create it refers to.
 */
export async function flush() {
  if (flushing) return { sent: 0, remaining: null }
  // No backend configured at all (the hosted build). Entries stay queued
  // harmlessly rather than being retried against nothing.
  if (!isApiConfigured()) return { sent: 0, remaining: null }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { sent: 0, remaining: null }
  }

  flushing = true
  try {
    let queue = await readQueue()
    let sent = 0

    while (queue.length > 0) {
      const entry = queue[0]
      const send = SENDERS[entry.kind]

      // An unknown kind would block the queue forever; drop it instead.
      if (!send) {
        queue = queue.slice(1)
        await writeQueue(queue)
        continue
      }

      const result = await send(entry.payload)
      // api.* resolves to null when the request failed. Stop and keep the rest.
      if (result === null || result === undefined || result === false) break

      listeners.forEach((listener) => {
        try {
          listener(entry, result)
        } catch {
          /* a listener must never stall the queue */
        }
      })

      queue = queue.slice(1)
      await writeQueue(queue)
      sent += 1
    }

    return { sent, remaining: queue.length }
  } finally {
    flushing = false
  }
}

let started = false

/** Flush at startup and whenever the device comes back online. */
export function startOutbox() {
  if (started || typeof window === 'undefined') return
  started = true
  window.addEventListener('online', () => flush())
  flush()
}
