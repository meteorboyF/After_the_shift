import { motion, useReducedMotion } from 'framer-motion'
import { pressProps } from '../lib/motion.js'
import { tapFeedback } from '../lib/haptics.js'
import Icon from './Icon.jsx'

/**
 * The only button shape in the app. Always clears the 64px tap minimum, always
 * full width in its column, generous radius, no sharp corners.
 *
 * `primary` carries an amber glow rather than a grey drop shadow. Use exactly
 * one per screen — two equally-weighted primaries means the screen needs a
 * redesign, not a second colour.
 */
const VARIANTS = {
  primary:
    'bg-amber text-ink font-semibold shadow-glow hover:bg-amber-glow active:bg-amber-glow',
  outline:
    'border-2 border-amber/50 text-cream hover:border-amber hover:bg-amber/5',
  quiet: 'border-2 border-muted/25 text-muted hover:border-muted/45 hover:text-cream',
  // For leaving / withdrawing. Warm ochre, never red — nothing here is a penalty.
  warn: 'border-2 border-warn/55 text-warn hover:border-warn hover:bg-warn/5',
}

export default function BigButton({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...rest
}) {
  const reduced = useReducedMotion()

  const handleClick = (event) => {
    tapFeedback()
    onClick?.(event)
  }

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      {...pressProps(reduced)}
      className={`tap flex w-full items-center justify-center gap-3 rounded-3xl px-6 py-4
        text-label leading-snug transition-colors duration-200 ease-calm
        disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={26} />}
      <span>{children}</span>
    </motion.button>
  )
}
