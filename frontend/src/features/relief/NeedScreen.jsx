import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useRelief } from '../../store/relief.js'
import { RELIEF_KEYS } from '../../lib/reliefPayload.js'
import { stagger } from '../../lib/motion.js'
import { tapFeedback } from '../../lib/haptics.js'

const OPTIONS = [
  { key: 'rest', icon: 'clock' },
  { key: 'swap', icon: 'swap' },
  { key: 'shade', icon: 'shade' },
]

/**
 * Screen 3A.
 *
 * The three options are P8's own description of what would have helped, kept in
 * his terms. The grey line under them is doing real work: it says up front that
 * no explanation is owed, before the next screen even offers to take one.
 */
export default function NeedScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const setDraft = useRelief((s) => s.setDraft)

  const choose = (key) => {
    tapFeedback()
    setDraft({ type: RELIEF_KEYS[key], reasonAudioBase64: null, reasonTranscript: null })
    navigate('/relief/reason')
  }

  return (
    <ScreenShell
      guard="day_post"
      guardOpacity={0.2}
      onBack={() => navigate('/')}
      backLabel={t('common.back')}
    >
      <h1 className="mt-2 text-display font-semibold text-cream">{t('relief.heading')}</h1>

      <div className="mt-8 flex flex-1 flex-col gap-4">
        {OPTIONS.map((option, index) => (
          <motion.button
            key={option.key}
            type="button"
            {...stagger(false, index)}
            onClick={() => choose(option.key)}
            className="tap flex items-center gap-5 rounded-4xl bg-ink-soft/85 p-5 text-left
              transition-colors duration-200 ease-calm hover:bg-ink-raised"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-amber/12 text-amber">
              <Icon name={option.icon} size={32} strokeWidth={1.7} />
            </span>
            <span className="text-label font-semibold leading-snug text-cream">
              {t(`relief.${option.key}`)}
            </span>
          </motion.button>
        ))}
      </div>

      <p className="mt-6 text-base text-muted">{t('relief.noReasonNeeded')}</p>
    </ScreenShell>
  )
}
