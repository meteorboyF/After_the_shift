import { create } from 'zustand'
import { enqueue } from '../lib/outbox.js'
import { toExerciseType } from '../lib/exercises.js'

const COUNTER_KEY = 'ats-grounding-count'

/**
 * An anonymous counter and nothing else.
 *
 * Screen 2D promises the exercise was not recorded anywhere, so this store
 * deliberately keeps no history: no list of sessions, no dates, no which
 * exercise, no how long. Just a number that goes up, which is the most that
 * "persist nothing except an anonymous local counter" allows.
 *
 * The number is never shown to the guard either — surfacing it would turn it
 * into a streak, which rule 3 rules out.
 */
export const useGrounding = create((set, get) => ({
  count: Number(localStorage.getItem(COUNTER_KEY) ?? 0),

  /**
   * Called when an exercise ends, whether it ran to the end or was abandoned.
   * Leaving early is a normal outcome and is recorded identically.
   */
  record({ exercise, completed, elapsedSec }) {
    const next = get().count + 1
    set({ count: next })
    localStorage.setItem(COUNTER_KEY, String(next))

    // Queued like everything else. Note there is no meta here — nothing links
    // this entry back to a person, not even while it sits in the outbox.
    enqueue('grounding', {
      exerciseType: toExerciseType(exercise),
      completed,
      abandonedAtSec: completed ? null : Math.round(elapsedSec),
    })
  },
}))
