/**
 * Motion is calm here, never bouncy. One easing curve, slow durations, and a
 * reduced-motion path that collapses every transform to a plain opacity fade.
 */

export const EASE_CALM = [0.22, 1, 0.36, 1]

/** Page transition: fade + 12px slide, 280ms. */
export function pageVariants(reduced) {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      enter: { opacity: 1, transition: { duration: 0.18 } },
      exit: { opacity: 0, transition: { duration: 0.12 } },
    }
  }
  return {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_CALM } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: EASE_CALM } },
  }
}

/** Voice button at rest: 4s breath, scale 1 → 1.04. */
export function breathingPulse(reduced) {
  if (reduced) return {}
  return {
    scale: [1, 1.04, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  }
}

/** Press feedback. Never a bounce — a small, immediate settle. */
export function pressProps(reduced) {
  return reduced ? {} : { whileTap: { scale: 0.97, transition: { duration: 0.08 } } }
}

/** Staggered list entry for card stacks. */
export function stagger(reduced, index) {
  if (reduced) return { initial: { opacity: 0 }, animate: { opacity: 1 } }
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.32, delay: index * 0.06, ease: EASE_CALM },
  }
}
