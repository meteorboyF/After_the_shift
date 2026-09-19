import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useCheckins } from '../../store/checkins.js'
import { base64ToObjectUrl, formatElapsed } from '../../lib/audio.js'
import { formatDay } from '../../lib/time.js'
import { stagger } from '../../lib/motion.js'
import { tapFeedback } from '../../lib/haptics.js'

/**
 * Playback and deletion of past entries.
 *
 * Every entry can be removed, with no confirmation step and no warning copy —
 * deleting your own words is not a mistake to be guarded against.
 */
export default function EntriesScreen() {
  const navigate = useNavigate()
  const { t, n, lang } = useT()
  const load = useCheckins((s) => s.load)
  const entries = useCheckins((s) => s.entries)
  const remove = useCheckins((s) => s.remove)

  const [playingId, setPlayingId] = useState(null)
  const audioRef = useRef(null)
  const urlsRef = useRef(new Map())

  useEffect(() => {
    load()
  }, [load])

  // Object URLs are created lazily and revoked together on unmount, so playing
  // the same entry twice does not leak a new blob each time. The ref is only
  // touched inside effects and handlers, never during render.
  useEffect(() => {
    const urls = urlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
      // Read at teardown, not at setup: at setup nothing is playing yet, so
      // capturing the value here would leave a playing entry running.
      audioRef.current?.pause()
    }
  }, [])

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)),
    [entries],
  )

  const toggle = (entry) => {
    tapFeedback()

    if (playingId === entry.localId) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }

    audioRef.current?.pause()
    if (!entry.audioBase64) return

    const urls = urlsRef.current
    if (!urls.has(entry.localId)) {
      urls.set(entry.localId, base64ToObjectUrl(entry.audioBase64, entry.mimeType))
    }

    const audio = new Audio(urls.get(entry.localId))
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    audio.play().catch(() => setPlayingId(null))
    setPlayingId(entry.localId)
  }

  const handleRemove = (entry) => {
    if (playingId === entry.localId) {
      audioRef.current?.pause()
      setPlayingId(null)
    }
    const urls = urlsRef.current
    const url = urls.get(entry.localId)
    if (url) {
      URL.revokeObjectURL(url)
      urls.delete(entry.localId)
    }
    remove(entry.localId)
  }

  return (
    <ScreenShell
      guard="resting"
      guardOpacity={0.16}
      onBack={() => navigate('/')}
      backLabel={t('common.back')}
    >
      <h1 className="mt-2 text-label-lg font-semibold text-cream">{t('entries.heading')}</h1>

      {sorted.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-base text-muted">{t('entries.empty')}</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {sorted.map((entry, index) => {
            const playing = playingId === entry.localId
            return (
              <motion.li
                key={entry.localId}
                {...stagger(false, index)}
                className="flex items-center gap-3 rounded-3xl bg-ink-soft/80 p-3"
              >
                <button
                  type="button"
                  onClick={() => toggle(entry)}
                  disabled={!entry.audioBase64}
                  aria-label={playing ? t('entries.pause') : t('entries.play')}
                  className={`tap flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl
                    transition-colors duration-200 ease-calm disabled:opacity-35
                    ${playing ? 'bg-amber text-ink' : 'bg-ink-raised text-amber'}`}
                >
                  <Icon name={playing ? 'breathe' : 'speaker'} size={26} />
                </button>

                <div className="min-w-0 flex-1">
                  <p className="text-label text-cream">{formatDay(entry.recordedAt, lang)}</p>
                  <p className="text-sm text-muted">
                    {entry.shiftType === 'NIGHT' ? t('entries.night') : t('entries.day')}
                    {' · '}
                    {entry.audioBase64
                      ? formatElapsed(entry.durationSec, n)
                      : t('entries.noAudio')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(entry)}
                  aria-label={t('entries.remove')}
                  className="tap flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl
                    text-muted transition-colors duration-200 ease-calm hover:text-warn"
                >
                  <Icon name="cross" size={24} />
                </button>
              </motion.li>
            )
          })}
        </ul>
      )}
    </ScreenShell>
  )
}
