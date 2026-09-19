import { motion, useReducedMotion } from 'framer-motion'
import { EASE_CALM } from '../lib/motion.js'

/**
 * Seven boxes, oldest to newest. A filled box is a day with an entry.
 *
 * Deliberately unlabelled. Putting weekday names under the boxes would make
 * every gap nameable — "you missed Tuesday" — which is exactly the guilt
 * mechanic rule 3 rules out. There is no counter, no percentage and no streak
 * for the same reason. A gap is just a gap.
 */
export default function WeekStrip({ week = [], label }) {
  const reduced = useReducedMotion()

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2.5">
        {week.map((filled, index) => (
          <motion.span
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: EASE_CALM }}
            className={`h-10 w-10 rounded-2xl ${
              filled ? 'bg-amber shadow-glow' : 'border-2 border-ink-raised bg-ink-soft'
            }`}
          />
        ))}
      </div>
      {label && <p className="text-sm text-muted">{label}</p>}
    </div>
  )
}
