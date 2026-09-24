import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, Eye, Mic, Send, X } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import PlayButton from '../../components/PlayButton.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useClock } from '../../lib/clock.js'
import { buildPayload } from '../../lib/relief.js'
import { clockElapsed, useRecorder } from '../../lib/recorder.js'
import { num } from '../../lib/format.js'
import { TYPE_META } from './common.jsx'

/**
 * 3B. Sending WITHOUT a reason is the filled, top option. Attaching one is
 * optional, spoken, and — said on screen before recording — heard by the
 * supervisor in the guard's own voice. One microphone, not two (audit C6).
 */
export default function ReasonScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const draft = useApp((s) => s.draft)
  const setDraft = useApp((s) => s.setDraft)
  const rec = useRecorder()
  const [mode, setMode] = useState(draft?.reason ? 'attached' : 'choose')
  const [failed, setFailed] = useState(false)

  if (!draft) return <Navigate to="/relief" replace />
  const meta = TYPE_META[draft.type]
  const TypeIcon = meta.icon

  const toPreview = (reason) => {
    const payload = buildPayload({ type: draft.type, reason, now: useClock.getState().now() })
    setDraft({ ...draft, reason, payload })
    navigate('/relief/preview')
  }

  const startReason = async () => {
    setFailed(false)
    setMode('recording')
    await rec.start()
  }

  const finishReason = async () => {
    const { blob, durationSec } = await rec.stop()
    if (!blob) {
      setFailed(true)
      setMode('choose')
      return
    }
    setDraft({ ...draft, reason: { audio: blob, durationSec } })
    setMode('attached')
  }

  const elapsed = clockElapsed(rec.elapsed, (s) => num(s, lang))
  const bars = Array.from({ length: 7 }, (_, i) => rec.levels[i] ?? 0)

  return (
    <Screen zone="super" back={mode === 'recording' ? undefined : '/relief'} topLeft={mode === 'recording' ? <span /> : undefined}>
      <span className="mt-2 flex w-fit items-center gap-2 rounded-full bg-amber/10 px-3 py-1 text-body font-medium text-amber-text">
        <TypeIcon size={18} strokeWidth={2} aria-hidden="true" />
        {t(`relief.${meta.key}`)}
      </span>
      <Heading className="mt-3">{t('relief.reasonHeading')}</Heading>

      {mode === 'recording' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center" aria-live="polite">
          <span className="relative flex h-36 w-36 items-center justify-center rounded-full bg-amber-glow shadow-glow-lg" aria-hidden="true">
            <span className="flex h-16 items-center gap-1.5">
              {bars.map((v, i) => (
                <span key={i} className="w-2 rounded-full bg-ink transition-[height] duration-100" style={{ height: `${12 + v * 48}px` }} />
              ))}
            </span>
          </span>
          <p className="text-label-lg font-semibold text-cream">
            {rec.status === 'failed' ? t('checkin.noMic') : t('relief.listening')}
          </p>
          <p className="text-label tabular-nums text-sand">{elapsed}</p>
        </div>
      )}

      {mode === 'attached' && draft.reason && (
        <div className="flex flex-1 flex-col justify-center">
          <div className="surface flex items-center gap-3 p-3">
            <PlayButton blob={draft.reason.audio} label={t('relief.voiceReason')} pauseLabel={t('checkin.pause')} />
            <span className="flex flex-1 flex-col">
              <span className="text-label text-cream">{t('relief.reasonAttached')}</span>
              <span className="text-body tabular-nums text-sand">
                {clockElapsed(draft.reason.durationSec, (s) => num(s, lang))}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setDraft({ ...draft, reason: null })
                setMode('choose')
              }}
              aria-label={t('relief.removeReason')}
              className="flex h-16 w-16 items-center justify-center rounded-full text-sand hover:text-warn"
            >
              <X size={26} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 px-1 text-body text-sand">{t('relief.reasonWho')}</p>
        </div>
      )}

      {mode === 'choose' && <div className="flex-1" />}

      <div className="flex flex-col gap-3 pt-8">
        {mode === 'choose' && (
          <>
            {failed && <p className="text-body text-warn">{t('checkin.noMic')}</p>}
            <Button variant="primary" icon={Send} label={t('relief.sendWithout')} onClick={() => toPreview(null)} />
            <Button variant="secondary" icon={Mic} label={t('relief.sayReason')} sub={t('relief.reasonWho')} onClick={startReason} />
          </>
        )}
        {mode === 'recording' && (
          <Button variant="primary" icon={Check} label={t('relief.done')} onClick={finishReason} />
        )}
        {mode === 'attached' && (
          <Button variant="primary" icon={Eye} label={t('relief.next')} onClick={() => toPreview(draft.reason)} />
        )}
      </div>
    </Screen>
  )
}
