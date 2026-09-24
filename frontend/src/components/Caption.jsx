import { AnimatePresence, motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useCaption } from '../lib/speech.js'

/** The visible half of "read aloud": the words, large, near the thumb. */
export default function Caption() {
  const text = useCaption((s) => s.text)
  const hide = useCaption((s) => s.hide)
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-28 z-50 mx-auto max-w-phone px-4">
      <AnimatePresence>
        {text && (
          <motion.button
            type="button"
            onClick={hide}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="surface-raised pointer-events-auto flex w-full items-start gap-3 px-5 py-4 text-left text-label text-cream"
          >
            <Volume2 size={26} strokeWidth={1.75} className="mt-1 shrink-0 text-amber-glow" aria-hidden="true" />
            <span>{text}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
