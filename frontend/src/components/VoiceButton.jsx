import { motion, useReducedMotion } from 'framer-motion'
import { breathingPulse, pressProps } from '../lib/motion.js'
import { tapFeedback } from '../lib/haptics.js'
import Icon from './Icon.jsx'

/**
 * The primary voice control: 160px at rest on the home screen, smaller where
 * speaking is optional rather than expected (Task 3's reason step).
 *
 * At rest it breathes on a 4s cycle. Under prefers-reduced-motion the breath
 * and the halo both stop and the button just sits there.
 */
export default function VoiceButton({
  onClick,
  label,
  size = 160,
  active = false,
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion()

  const handleClick = (event) => {
    tapFeedback()
    onClick?.(event)
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* halo — the sodium-lamp glow, not a drop shadow */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-amber/20 blur-xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.78, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={label}
          animate={active ? undefined : breathingPulse(reduced)}
          {...pressProps(reduced)}
          className={`relative flex h-full w-full items-center justify-center rounded-full
            text-ink shadow-glow-lg transition-colors duration-200 ease-calm
            ${active ? 'bg-amber-glow' : 'bg-amber hover:bg-amber-glow'}`}
          style={{ width: size, height: size }}
          {...rest}
        >
          <Icon name="mic" size={Math.round(size * 0.34)} strokeWidth={1.6} />
        </motion.button>
      </div>

      {label && <span className="text-label-lg font-semibold text-cream">{label}</span>}
    </div>
  )
}
