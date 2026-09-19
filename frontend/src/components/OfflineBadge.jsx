import { motion } from 'framer-motion'
import { useOnline } from '../lib/useOnline.js'
import { useT } from '../lib/useT.js'

/**
 * Offline is the assumed condition, not an error. So this is a small muted pill
 * that says the entry is on the phone — never a modal, never a banner, never
 * red, and it never blocks anything.
 *
 * No AnimatePresence here. Wrapping it in one means the badge only unmounts
 * once its exit animation reports completion, and when that report does not
 * arrive the pill stays on screen after the connection is back — telling the
 * guard their entry is not syncing when it is. A stale reassurance is worse
 * than no fade, so it mounts with a fade and disappears the moment it should.
 */
export default function OfflineBadge() {
  const online = useOnline()
  const { t } = useT()

  if (online) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none flex items-center gap-2 rounded-full bg-ink-raised/80
        px-3 py-1.5 text-sm text-muted"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-muted/70" />
      <span>
        {t('common.offline')} · {t('common.offlineHint')}
      </span>
    </motion.div>
  )
}
