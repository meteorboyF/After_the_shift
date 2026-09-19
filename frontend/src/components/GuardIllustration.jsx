import { motion, useReducedMotion } from 'framer-motion'
import { pickGuardImage } from '../lib/guardImages.js'

/**
 * A guard photograph used as a backdrop.
 *
 * The photo reflects where you are in the app and what time it is — never how
 * the user feels. There is no picker, no grid, and no emotion label anywhere
 * near it. See lib/guardImages.js for the selection logic.
 *
 * Treatment: desaturate, then lay amber over it with mix-blend-color so it
 * reads as a duotone inside the palette rather than a pasted stock photo. A
 * vignette and a top-lit gradient sit over that — one light source, from above.
 */
export default function GuardIllustration({
  name,
  seed = 0,
  placement = 'backdrop',
  opacity = 0.32,
}) {
  const reduced = useReducedMotion()
  const src = pickGuardImage(name, seed)
  if (!src) return null

  const frame =
    placement === 'corner'
      ? 'absolute bottom-0 right-[-12%] h-[46%] w-[86%]'
      : 'absolute inset-0'

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.2 : 1.6, ease: 'easeOut' }}
    >
      <div className={frame} style={{ opacity }}>
        <div
          className="relative h-full w-full"
          style={
            placement === 'corner'
              ? {
                  maskImage:
                    'radial-gradient(ellipse at 60% 70%, #000 30%, transparent 72%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse at 60% 70%, #000 30%, transparent 72%)',
                }
              : undefined
          }
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover [filter:grayscale(1)_brightness(0.82)_contrast(1.08)]"
          />
          <div className="absolute inset-0 bg-amber mix-blend-color" />
          <div className="absolute inset-0 bg-amber-deep/30 mix-blend-overlay" />
        </div>
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_26%,rgba(18,21,31,0.86)_78%)]" />
      {/* sodium lamp, always from above */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,196,107,0.15),transparent_58%)]" />
      {/* keep text at >=7:1 over whatever the photo is doing underneath */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/72 to-ink" />
    </motion.div>
  )
}
