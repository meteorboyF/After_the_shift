import { motion, useReducedMotion } from 'framer-motion'
import { pageVariants } from '../lib/motion.js'
import { tapFeedback } from '../lib/haptics.js'
import { useLocation } from 'react-router-dom'
import GuardIllustration from './GuardIllustration.jsx'
import OfflineBadge from './OfflineBadge.jsx'
import DemoChip from './DemoChip.jsx'
import Icon from './Icon.jsx'

/**
 * Every screen sits in this. Single column, 480px, centred, mobile-first.
 *
 * `bare` strips the top row entirely — used by the grounding exercise, which
 * must be the emptiest screen in the app and must not offer a small corner exit
 * competing with its full-size Stop control.
 */
export default function ScreenShell({
  children,
  footer,
  guard,
  guardSeed = 0,
  guardPlacement = 'backdrop',
  guardOpacity = 0.32,
  onBack,
  backLabel,
  topRight,
  bare = false,
  /** The demo launcher is a list and needs to scroll; guard screens never do. */
  scrollable = false,
  className = '',
}) {
  const reduced = useReducedMotion()
  const variants = pageVariants(reduced)
  const isDemoIndex = useLocation().pathname === '/demo'

  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="enter"
      className={`relative mx-auto flex min-h-dvh w-full max-w-screenish flex-col
        ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'} px-6 pb-8 pt-5 ${className}`}
    >
      {guard && (
        <GuardIllustration
          name={guard}
          seed={guardSeed}
          placement={guardPlacement}
          opacity={guardOpacity}
        />
      )}

      {!bare && (
        <div className="relative z-10 flex min-h-tap items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={() => {
                tapFeedback()
                onBack()
              }}
              aria-label={backLabel}
              className="tap -ml-3 flex items-center gap-1 rounded-2xl px-3 text-muted
                transition-colors duration-200 ease-calm hover:text-cream"
            >
              <Icon name="back" size={26} />
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <OfflineBadge />
            {/* The launcher passes its own topRight, so it never shows a chip
                pointing back at itself. */}
            {!isDemoIndex && <DemoChip />}
            {topRight}
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>

      {footer && <div className="relative z-10 mt-6">{footer}</div>}
    </motion.main>
  )
}
