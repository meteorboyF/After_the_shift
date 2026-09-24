import { useNavigate } from 'react-router-dom'
import { Check, MicOff, X } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import { useT } from '../../i18n/index.js'
import { clockElapsed, useRecorder } from '../../lib/recorder.js'
import { useCheckins } from '../../store/checkins.js'
import { useApp } from '../../store/app.js'
import { useClock } from '../../lib/clock.js'
import { shiftState } from '../../lib/roster.js'
import { num } from '../../lib/format.js'

/**
 * 1B — recording. Starts on arrival, so speaking is one tap from Home.
 *
 * This screen listens; it does not ask. No prompt, no question, no suggestion
 * chips, nothing that resembles a mood control.
 */
export default function RecordScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const rec = useRecorder({ autoStart: true })
  const setPending = useCheckins((s) => s.setPending)
  const anchor = useApp((s) => s.anchor)
  const failed = rec.status === 'failed'

  const finish = async () => {
    const { blob, durationSec, transcript } = await rec.stop()
    const now = useClock.getState().now()
    const kind = anchor ? (shiftState(anchor, now).focus?.kind ?? 'DAY') : 'DAY'
    setPending({ recordedAt: now.toISOString(), durationSec, audio: blob, transcript, shiftKind: kind })
    navigate('/checkin/privacy', { replace: true })
  }

  const cancel = () => {
    rec.cancel()
    navigate('/', { replace: true })
  }

  const bars = Array.from({ length: 7 }, (_, i) => rec.levels[i] ?? 0)

  return (
    <Screen zone="mine" topLeft={<span />} lamp={1.15}>
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="relative flex h-48 w-48 items-center justify-center" aria-hidden="true">
          {!failed && <span className="anim-halo absolute -inset-6 rounded-full bg-amber/25 blur-2xl" />}
          <span
            className={`relative flex h-full w-full items-center justify-center rounded-full ${
              failed ? 'border-2 border-ink-line bg-ink-raised' : 'bg-amber-glow shadow-glow-lg'
            }`}
            style={failed ? undefined : { backgroundImage: 'radial-gradient(circle at 50% 28%, rgba(255,236,200,0.55), rgba(255,196,107,0) 55%)' }}
          >
            {failed ? (
              <MicOff size={56} strokeWidth={1.6} className="text-sand" />
            ) : (
              <span className="flex h-20 items-center gap-2">
                {bars.map((v, i) => (
                  <span
                    key={i}
                    className="w-2.5 rounded-full bg-ink transition-[height] duration-100 ease-linear"
                    style={{ height: `${16 + v * 60}px` }}
                  />
                ))}
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1" aria-live="polite">
          <Heading>
            {failed ? t('checkin.noMic') : rec.status === 'recording' ? t('checkin.listening') : t('checkin.starting')}
          </Heading>
          {failed ? (
            <p className="text-label text-sand">{t('checkin.noMicHint')}</p>
          ) : (
            <p className="text-label tabular-nums text-sand">{clockElapsed(rec.elapsed, (s) => num(s, lang))}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="primary" icon={Check} label={t('checkin.done')} onClick={finish} />
        <Button variant="quiet" icon={X} label={t('checkin.cancel')} onClick={cancel} />
      </div>
    </Screen>
  )
}
