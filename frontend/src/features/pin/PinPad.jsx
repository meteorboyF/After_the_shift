import { motion, useReducedMotion } from 'framer-motion'
import { pressProps } from '../../lib/motion.js'
import { tapFeedback } from '../../lib/haptics.js'
import { useT } from '../../lib/useT.js'
import Icon from '../../components/Icon.jsx'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * A tapped keypad, not a text field. Digits render in the active script, so a
 * Bangla user sees ১ ২ ৩ rather than Latin numerals on their own PIN.
 */
export default function PinPad({ onDigit, onErase, disabled = false }) {
  const reduced = useReducedMotion()
  const { t, n } = useT()

  const keyClass = `tap flex h-[4.4rem] items-center justify-center rounded-3xl
    bg-ink-raised/70 text-[1.75rem] font-semibold text-cream
    transition-colors duration-200 ease-calm hover:bg-ink-raised
    disabled:opacity-40`

  return (
    <div className="grid grid-cols-3 gap-3">
      {KEYS.map((digit) => (
        <motion.button
          key={digit}
          type="button"
          disabled={disabled}
          {...pressProps(reduced)}
          onClick={() => {
            tapFeedback()
            onDigit(digit)
          }}
          className={keyClass}
        >
          {n(digit)}
        </motion.button>
      ))}

      <span />

      <motion.button
        type="button"
        disabled={disabled}
        {...pressProps(reduced)}
        onClick={() => {
          tapFeedback()
          onDigit('0')
        }}
        className={keyClass}
      >
        {n('0')}
      </motion.button>

      <motion.button
        type="button"
        disabled={disabled}
        aria-label={t('pin.erase')}
        {...pressProps(reduced)}
        onClick={() => {
          tapFeedback()
          onErase()
        }}
        className={`${keyClass} text-muted`}
      >
        <Icon name="back" size={28} />
      </motion.button>
    </div>
  )
}
