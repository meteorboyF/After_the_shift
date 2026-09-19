import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import LanguageToggle from '../../components/LanguageToggle.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { stagger } from '../../lib/motion.js'

/**
 * Reached from the tiny link on home.
 *
 * Four statements, no instructions. Guards who framed this as "it just listens"
 * accepted it; guards who heard "an app for work complaints" refused. The help
 * screen repeats the accepted framing rather than explaining features.
 *
 * The last line is deliberate: this is a course prototype, and saying so is
 * more honest than letting it imply it is care.
 */
const POINTS = [
  { key: 'listens', icon: 'mic' },
  { key: 'privacy', icon: 'cross' },
  { key: 'offline', icon: 'lamp' },
  { key: 'relief', icon: 'clock' },
]

export default function HelpScreen() {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    <ScreenShell
      guard="greeting"
      guardOpacity={0.16}
      onBack={() => navigate('/')}
      backLabel={t('common.back')}
      topRight={<LanguageToggle />}
      footer={
        <BigButton variant="quiet" onClick={() => navigate('/')}>
          {t('common.back')}
        </BigButton>
      }
    >
      <h1 className="mt-2 text-label-lg font-semibold text-cream">{t('help.heading')}</h1>

      <ul className="mt-7 flex flex-1 flex-col gap-6">
        {POINTS.map((point, index) => (
          <motion.li key={point.key} {...stagger(false, index)} className="flex items-start gap-4">
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber/12 text-amber">
              <Icon name={point.icon} size={22} />
            </span>
            <span>
              <span className="block text-label leading-snug text-cream">
                {t(`help.${point.key}`)}
              </span>
              <span className="mt-1 block text-base leading-relaxed text-muted">
                {t(`help.${point.key}Body`)}
              </span>
            </span>
          </motion.li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">{t('help.notClinical')}</p>
    </ScreenShell>
  )
}
