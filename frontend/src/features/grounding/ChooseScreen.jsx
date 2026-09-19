import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { EXERCISES, EXERCISE_ORDER } from '../../lib/exercises.js'
import { speak, stopSpeaking } from '../../lib/speech.js'
import { stagger } from '../../lib/motion.js'
import { tapFeedback } from '../../lib/haptics.js'

/**
 * Screen 2B, reached in one tap from home — no confirmation, no form, nothing
 * to fill in first.
 *
 * The speaker reads the options aloud for guards who would rather listen than
 * read, which is not a niche case: P5 carries a button phone and several
 * participants are reading at 3am after twelve hours.
 *
 * A full-width exit sits under the cards. Rule 4 says the exercise must be
 * abandonable from every screen, and that includes this one — but as an outline
 * button, not a corner "×".
 */
export default function ChooseScreen() {
  const navigate = useNavigate()
  const { t } = useT()

  useEffect(() => () => stopSpeaking(), [])

  const readAloud = () => {
    tapFeedback()
    const spoken = EXERCISE_ORDER.map((key) => t(`grounding.${key}`)).join('. ')
    speak(`${t('grounding.heading')}. ${spoken}`)
  }

  const leave = () => {
    stopSpeaking()
    navigate('/')
  }

  return (
    <ScreenShell
      guard="after_incident"
      guardOpacity={0.22}
      topRight={
        <button
          type="button"
          onClick={readAloud}
          aria-label={t('grounding.listen')}
          className="tap flex items-center justify-center rounded-2xl px-3 text-amber
            transition-colors duration-200 ease-calm hover:text-amber-glow"
        >
          <Icon name="speaker" size={26} />
        </button>
      }
      footer={
        <BigButton variant="quiet" onClick={leave}>
          {t('grounding.exit')}
        </BigButton>
      }
    >
      <h1 className="mt-4 text-display font-semibold text-cream">{t('grounding.heading')}</h1>

      <div className="mt-8 flex flex-1 flex-col gap-4">
        {EXERCISE_ORDER.map((key, index) => {
          const exercise = EXERCISES[key]
          return (
            <motion.button
              key={key}
              type="button"
              {...stagger(false, index)}
              onClick={() => {
                tapFeedback()
                stopSpeaking()
                navigate(`/grounding/${key}`)
              }}
              className="tap flex items-center gap-5 rounded-4xl bg-ink-soft/85 p-5 text-left
                transition-colors duration-200 ease-calm hover:bg-ink-raised"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-amber/12 text-amber">
                <Icon name={exercise.icon} size={32} strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block text-label font-semibold leading-snug text-cream">
                  {t(`grounding.${key}`)}
                </span>
                <span className="mt-1 block text-base text-muted">
                  {t('grounding.minutes', { n: exercise.minutes })}
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </ScreenShell>
  )
}
