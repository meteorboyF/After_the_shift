import { Navigate, useNavigate } from 'react-router-dom'
import { Check, Smartphone, Trash2, X } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import PlayButton from '../../components/PlayButton.jsx'
import { useT } from '../../i18n/index.js'
import { useCheckins } from '../../store/checkins.js'
import { clockElapsed } from '../../lib/recorder.js'
import { num } from '../../lib/format.js'

/**
 * 1C — said plainly, before anything is stored: who can see this.
 * "Delete" is the same size as "Keep" — deleting must not feel like a penalty.
 */
export default function PrivacyScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const pending = useCheckins((s) => s.pending)
  const keep = useCheckins((s) => s.keepPending)
  const discard = useCheckins((s) => s.discardPending)

  if (!pending) return <Navigate to="/checkin/saved" replace />

  return (
    <Screen zone="mine" topLeft={<span />}>
      <Heading className="mt-4">{t('checkin.privacyHeading')}</Heading>

      <ul className="mt-8 flex flex-col gap-5">
        <li className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ok/15 text-ok">
            <Check size={28} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-label text-cream">{t('checkin.onlyYou')}</span>
        </li>
        <li className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-warn/15 text-warn">
            <X size={36} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="text-label-lg font-semibold leading-snug text-cream">{t('checkin.notSupervisor')}</span>
        </li>
        <li className="flex items-start gap-4 pl-2">
          <Smartphone size={26} strokeWidth={1.75} className="mt-1 shrink-0 text-zone-mine" aria-hidden="true" />
          <span className="text-body text-sand">{t('checkin.staysOnPhone')}</span>
        </li>
      </ul>

      {pending.audio && (
        <div className="surface mt-8 flex items-center gap-4 p-3 pr-5">
          <PlayButton blob={pending.audio} label={t('checkin.listenBack')} pauseLabel={t('checkin.pause')} />
          <span className="flex flex-col">
            <span className="text-label text-cream">{t('checkin.listenBack')}</span>
            <span className="text-body tabular-nums text-sand">{clockElapsed(pending.durationSec, (s) => num(s, lang))}</span>
          </span>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          variant="primary"
          icon={Check}
          label={t('checkin.keep')}
          onClick={async () => {
            await keep()
            navigate('/checkin/saved', { replace: true })
          }}
        />
        <Button
          variant="secondary"
          icon={Trash2}
          label={t('checkin.discard')}
          onClick={() => {
            navigate('/', { replace: true })
            discard()
          }}
        />
      </div>
    </Screen>
  )
}
