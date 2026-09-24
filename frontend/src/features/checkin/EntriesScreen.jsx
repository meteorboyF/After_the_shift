import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mic, MicOff, Trash2 } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import PlayButton from '../../components/PlayButton.jsx'
import Undo from '../../components/Undo.jsx'
import { useT } from '../../i18n/index.js'
import { useCheckins } from '../../store/checkins.js'
import { useNow } from '../../lib/clock.js'
import { clockTime, num, relativeDay } from '../../lib/format.js'
import { clockElapsed } from '../../lib/recorder.js'
import { useLongPress } from '../../lib/useLongPress.js'

/** Past entries: play any, delete any. Deleting is instant, with a 5-second undo. */
export default function EntriesScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const load = useCheckins((s) => s.load)
  const entries = useCheckins((s) => s.entries)
  const lastRemoved = useCheckins((s) => s.lastRemoved)
  const undo = useCheckins((s) => s.undoRemove)
  const clearUndo = useCheckins((s) => s.clearUndo)
  const expire = useCallback(() => clearUndo(), [clearUndo])

  useEffect(() => {
    load()
    return () => clearUndo()
  }, [load, clearUndo])

  return (
    <Screen zone="mine" back="/">
      <Heading className="mt-2">{t('entries.heading')}</Heading>
      <p className="mt-1 flex items-center gap-2 text-body text-sand">
        <Lock size={18} strokeWidth={2} className="text-zone-mine" aria-hidden="true" />
        {t('entries.sub')}
      </p>

      {entries.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-raised text-amber-glow">
            <Mic size={34} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="text-label text-cream">{t('entries.empty')}</p>
          <p className="text-body text-sand">{t('entries.emptyHint')}</p>
          <div className="mt-4 w-full">
            <Button variant="primary" icon={Mic} label={t('entries.record')} onClick={() => navigate('/checkin')} />
          </div>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3 pb-20">
          {entries.map((e) => (
            <EntryRow key={e.id} entry={e} />
          ))}
        </ul>
      )}

      <Undo
        open={Boolean(lastRemoved)}
        text={t('entries.removed')}
        action={t('entries.undo')}
        onUndo={undo}
        onExpire={expire}
      />
    </Screen>
  )
}

function EntryRow({ entry }) {
  const { t, lang } = useT()
  const now = useNow()
  const remove = useCheckins((s) => s.remove)
  const at = new Date(entry.recordedAt)
  const when = `${relativeDay(at, now, lang)}, ${clockTime(at, lang)}`
  const after = entry.shiftKind === 'NIGHT' ? t('entries.afterNight') : t('entries.afterDay')
  const press = useLongPress(`${t('entries.remove')}. ${when}`)

  return (
    <li className="surface flex items-center gap-3 p-3">
      {entry.audio ? (
        <PlayButton blob={entry.audio} label={`${t('entries.play')}. ${when}`} pauseLabel={t('entries.pause')} />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink-raised text-muted" aria-hidden="true">
          <MicOff size={24} strokeWidth={1.75} />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-label leading-snug text-cream">{when}</span>
        <span className="text-body leading-snug text-sand">
          {entry.audio || !entry.demo ? `${after}, ${clockElapsed(entry.durationSec, (s) => num(s, lang))}` : t('entries.demoNoSound')}
        </span>
      </span>
      <button
        type="button"
        onClick={() => remove(entry.id)}
        {...press}
        aria-label={`${t('entries.remove')}. ${when}`}
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sand transition-colors duration-300 ease-calm hover:bg-warn/10 hover:text-warn"
      >
        <Trash2 size={26} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </li>
  )
}
