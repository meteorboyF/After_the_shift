import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import { useT } from '../../lib/useT.js'
import { useGrounding } from '../../store/grounding.js'
import {
  BREATH,
  BREATH_CYCLE_SEC,
  EXERCISES,
  breathPhaseAt,
} from '../../lib/exercises.js'
import { speak, stopSpeaking } from '../../lib/speech.js'
import { breathIn, breathOut } from '../../lib/haptics.js'

/**
 * Screen 2C — the emptiest screen in the app.
 *
 * Absent on purpose: a countdown, a percentage, encouragement copy, and any
 * question about how the guard feels now. Asking that would turn grounding into
 * assessment, which is the one thing this screen must not become.
 *
 * Guidance is spoken and haptic as well as visual, so the exercise still works
 * with the screen dark and the phone in a pocket — P4 cannot use a phone openly
 * while on duty.
 *
 * "বন্ধ করুন" is full width, always on screen, and leaves instantly. No corner
 * "×", no confirmation dialog, no "are you sure".
 */
export default function ExerciseScreen() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { t } = useT()
  const reduced = useReducedMotion()
  const record = useGrounding((s) => s.record)

  const exercise = EXERCISES[type]

  const [elapsed, setElapsed] = useState(0)
  const startedRef = useRef(0)
  const endedRef = useRef(false)
  const lastPhaseRef = useRef(null)

  const isBreathing = type === 'breathing'
  const phase = isBreathing ? breathPhaseAt(elapsed) : null

  const end = useCallback(
    (completed) => {
      if (endedRef.current) return
      endedRef.current = true
      stopSpeaking()

      const ran = startedRef.current ? (Date.now() - startedRef.current) / 1000 : 0
      record({ exercise: type, completed, elapsedSec: ran })

      // Finishing shows 2D. Leaving early goes straight home — pushing someone
      // who just walked out through a "Done" screen would be a small
      // punishment, and stopping is a legitimate outcome, not a failure.
      navigate(completed ? '/grounding/done' : '/', { replace: true })
    },
    [navigate, record, type],
  )

  useEffect(() => {
    if (!exercise) {
      navigate('/grounding', { replace: true })
      return undefined
    }

    startedRef.current = Date.now()

    // Say what to do once, at the start, for the non-breathing exercises.
    if (!isBreathing) speak(t(exercise.cueKey))

    const timer = setInterval(() => {
      const next = (Date.now() - startedRef.current) / 1000
      setElapsed(next)
      if (next >= exercise.durationSec) end(true)
    }, 100)

    return () => {
      clearInterval(timer)
      stopSpeaking()
    }
  }, [exercise, isBreathing, navigate, t, end])

  // Speak and buzz on each change of breath, not on every tick.
  useEffect(() => {
    if (!isBreathing || phase === null || phase === lastPhaseRef.current) return
    lastPhaseRef.current = phase
    if (phase === 'in') {
      speak(t('grounding.in'))
      breathIn()
    } else if (phase === 'out') {
      speak(t('grounding.out'))
      breathOut()
    }
  }, [phase, isBreathing, t])

  if (!exercise) return null

  const progress = Math.min(1, elapsed / exercise.durationSec)

  // 1 → 1.6 over 4s, hold 2s, 1.6 → 1 over 6s. The asymmetry is the point.
  const breathAnimation = reduced
    ? { opacity: [0.45, 1, 1, 0.45] }
    : { scale: [1, 1.6, 1.6, 1] }

  const breathTransition = {
    duration: BREATH_CYCLE_SEC,
    times: [
      0,
      BREATH.inhaleSec / BREATH_CYCLE_SEC,
      (BREATH.inhaleSec + BREATH.holdSec) / BREATH_CYCLE_SEC,
      1,
    ],
    ease: ['easeInOut', 'linear', 'easeInOut'],
    repeat: Infinity,
  }

  return (
    <ScreenShell
      bare
      guard={exercise.guard}
      guardOpacity={0.12}
      footer={<BigButton variant="outline" onClick={() => end(false)}>{t('grounding.stop')}</BigButton>}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-14">
        <div className="flex h-72 items-center justify-center">
          <motion.div
            animate={isBreathing ? breathAnimation : reduced ? {} : { scale: [1, 1.08, 1] }}
            transition={
              isBreathing
                ? breathTransition
                : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }
            className="h-40 w-40 rounded-full border-2 border-amber bg-amber/15 shadow-glow-lg"
          />
        </div>

        {/* Two words, nothing else. No timer, no encouragement, no percentage. */}
        {isBreathing && (
          <p className="text-display font-semibold text-cream">
            {phase === 'out' ? t('grounding.out') : t('grounding.in')}
          </p>
        )}
      </div>

      {/* Thin, unlabelled. Shows that it is moving, not how much is left. */}
      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink-raised"
        role="presentation"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-amber/70"
          style={{ width: `${progress * 100}%`, transition: 'width 150ms linear' }}
        />
      </div>
    </ScreenShell>
  )
}
