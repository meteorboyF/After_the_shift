import { useEffect, useRef } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CircleStop } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import BreathingCircle, { phaseAt, useBreath } from '../../components/BreathingCircle.jsx'
import { useT } from '../../i18n/index.js'
import { speak } from '../../lib/speech.js'
import { countGrounding } from '../../store/grounding.js'
import { EXERCISES } from './exercises.js'

/**
 * 2C — the emptiest screen in the app.
 *
 * "বন্ধ করুন" is full width, always on screen, and leaves instantly — back to
 * wherever the guard came from. No corner ×, no "are you sure".
 * No countdown, no percentage, no encouragement, and never "how do you feel now?".
 *
 * Every cue is on screen as well as spoken (audit B7): many phones have no
 * Bangla voice, and a projector may be muted.
 */
export default function ExerciseScreen() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { t, lang } = useT()
  const exercise = EXERCISES[type]
  const from = state?.from ?? '/'
  const sec = useBreath(Boolean(exercise))
  const phase = phaseAt(sec)
  const lastPhase = useRef(null)
  const ended = useRef(false)

  // Keep the screen awake if the phone allows it.
  useEffect(() => {
    let lock = null
    navigator.wakeLock?.request?.('screen').then((l) => (lock = l)).catch(() => {})
    return () => lock?.release?.().catch(() => {})
  }, [])

  // Spoken + haptic cues.
  useEffect(() => {
    if (!exercise) return
    if (type !== 'breathing') {
      if (lastPhase.current === null) speak(t(`grounding.${type}Cue`), lang)
      lastPhase.current = 'started'
      return
    }
    if (phase !== lastPhase.current) {
      lastPhase.current = phase
      if (phase !== 'hold') {
        speak(t(`grounding.${phase}`), lang)
        navigator.vibrate?.(phase === 'in' ? [40] : [20, 60, 20])
      }
    }
  }, [phase, type, exercise, t, lang])

  // Natural end.
  useEffect(() => {
    if (exercise && sec >= exercise.seconds && !ended.current) {
      ended.current = true
      countGrounding(type)
      navigate('/grounding/done', { replace: true, state: { type, from } })
    }
  }, [sec, exercise, type, from, navigate])

  if (!exercise) return <Navigate to="/grounding" replace />

  const stop = () => {
    ended.current = true
    window.speechSynthesis?.cancel()
    navigate(from, { replace: true })
  }

  const Icon = exercise.icon
  const progress = Math.min(1, sec / exercise.seconds)

  return (
    <Screen zone="mine" topLeft={<span />} lamp={0.7}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        {type === 'breathing' ? (
          <>
            <BreathingCircle sec={sec} size={140} />
            <p className="font-display text-hero text-cream" aria-live="polite">
              {t(`grounding.${phase}`)}
            </p>
          </>
        ) : (
          <>
            <span className="relative flex h-48 w-48 items-center justify-center">
              <span className="anim-halo absolute inset-0 rounded-full bg-amber/15 blur-xl" aria-hidden="true" />
              <span className="anim-breathe relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-amber/70 bg-amber/10 text-amber-glow">
                <Icon size={64} strokeWidth={1.5} aria-hidden="true" />
              </span>
            </span>
            <p className="font-display text-title text-cream [text-wrap:balance]">{t(`grounding.${type}Cue`)}</p>
            <p className="text-label text-sand">{t(`grounding.${type}Cue2`)}</p>
          </>
        )}
      </div>

      {/* Thin and unlabelled: shows that it is moving, not how much is left. */}
      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-ink-raised" aria-hidden="true">
        <div className="h-full rounded-full bg-amber/70" style={{ width: `${progress * 100}%` }} />
      </div>
      <Button variant="secondary" icon={CircleStop} label={t('grounding.stop')} onClick={stop} />
    </Screen>
  )
}
