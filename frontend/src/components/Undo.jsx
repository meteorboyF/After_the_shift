import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

/** A 5-second undo bar. Deleting needs no confirmation, but a mis-tap is never permanent. */
export default function Undo({ open, text, action, onUndo, onExpire, seconds = 5 }) {
  useEffect(() => {
    if (!open) return undefined
    const id = setTimeout(onExpire, seconds * 1000)
    return () => clearTimeout(id)
  }, [open, onExpire, seconds])

  return (
    <div aria-live="polite" className="fixed inset-x-0 bottom-4 z-40 mx-auto max-w-phone px-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="surface-raised flex items-center justify-between gap-3 py-2 pl-5 pr-2"
          >
            <span className="min-w-0 flex-1 text-body text-cream">{text}</span>
            <button
              type="button"
              onClick={onUndo}
              className="tap flex shrink-0 items-center gap-2 whitespace-nowrap rounded-3xl px-4 text-label font-semibold text-amber-glow"
            >
              <RotateCcw size={22} strokeWidth={2} aria-hidden="true" />
              {action}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
