import { Navigate, useNavigate } from 'react-router-dom'
import { Building2, Send, X } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import PlayButton from '../../components/PlayButton.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useNow } from '../../lib/clock.js'
import { clockTime, num, relativeDay } from '../../lib/format.js'
import { clockElapsed } from '../../lib/recorder.js'
import { TYPE_META } from './common.jsx'

/**
 * 3C — exactly what the supervisor will see, rendered from the SAME frozen
 * payload that "পাঠান" writes to the supervisor zone. There is nothing else in
 * that object to show. Below it, the privacy wall, drawn on screen.
 */
export default function PreviewScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const now = useNow()
  const draft = useApp((s) => s.draft)
  const setDraft = useApp((s) => s.setDraft)
  const send = useApp((s) => s.sendRelief)

  if (!draft?.payload) return <Navigate to="/relief" replace />
  const payload = draft.payload
  const meta = TYPE_META[payload.type]
  const Icon = meta.icon
  const at = new Date(payload.createdAt)

  return (
    <Screen zone="super" back="/relief/reason">
      <Heading className="mt-2">{t('relief.previewHeading')}</Heading>

      <article className="mt-5 rounded-4xl border-2 border-zone-super/50 bg-ink-soft p-5 shadow-lift" aria-label={t('relief.previewHeading')}>
        <div className="flex items-center gap-2 text-body text-zone-super">
          <Building2 size={18} strokeWidth={2} aria-hidden="true" />
          <span>{t('relief.onSupervisorPhone')}</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber/10 text-amber-glow">
            <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-label-lg font-semibold leading-snug text-cream">{t(`relief.${meta.key}`)}</span>
            <span className="text-body text-sand">{`${relativeDay(at, now, lang)}, ${clockTime(at, lang)}`}</span>
          </span>
        </div>
        {payload.reason && (
          <div className="mt-4 flex items-center gap-3 border-t border-ink-line/70 pt-4">
            <PlayButton blob={payload.reason.audio} label={t('relief.voiceReason')} pauseLabel={t('checkin.pause')} />
            <span className="flex flex-col">
              <span className="text-label text-cream">{t('relief.voiceReason')}</span>
              <span className="text-body tabular-nums text-sand">{clockElapsed(payload.reason.durationSec, (s) => num(s, lang))}</span>
            </span>
          </div>
        )}
      </article>

      <section className="mt-6 px-1">
        <h2 className="text-label text-sand">{t('relief.willNotSee')}</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {['wCheckins', 'wRecordings', 'wExercises', 'wHours'].map((k) => (
            <li key={k} className="flex items-center gap-3 text-label text-cream">
              <X size={24} strokeWidth={2.2} className="shrink-0 text-warn" aria-hidden="true" />
              <span className="line-through decoration-warn/60 decoration-[1.5px]">{t(`relief.${k}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button
          variant="primary"
          icon={Send}
          label={t('relief.send')}
          onClick={async () => {
            const record = await send(payload)
            navigate('/relief/status', { replace: true, state: { justSent: record.id } })
          }}
        />
        <Button
          variant="secondary"
          icon={X}
          label={t('relief.cancel')}
          onClick={() => {
            navigate('/relief', { replace: true })
            setDraft(null)
          }}
        />
      </div>
    </Screen>
  )
}
