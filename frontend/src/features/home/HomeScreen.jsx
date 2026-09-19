import { useNavigate } from 'react-router-dom'
import ScreenShell from '../../components/ScreenShell.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import BigButton from '../../components/BigButton.jsx'
import LanguageToggle from '../../components/LanguageToggle.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { homeKey } from '../../lib/guardImages.js'

/**
 * Screen 1A.
 *
 * Deliberately absent: any greeting by name, a date banner, statistics, a
 * notification badge, or anything resembling a mood prompt. The question is
 * about the duty that just ended, not about the person.
 *
 * The backdrop follows the clock — night post after 18:00, day post before.
 */
export default function HomeScreen() {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    <ScreenShell guard={homeKey()} guardSeed={new Date().getDate()} topRight={<LanguageToggle />}>
      <div className="mt-6">
        <h1 className="measure text-display font-semibold leading-tight text-cream">
          {t('home.heading')}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-base text-muted">
          <Icon name="clock" size={20} />
          <span>{t('home.shiftLine', { hours: 12 })}</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-10 py-8">
        <VoiceButton label={t('home.speak')} onClick={() => navigate('/record')} />

        <BigButton variant="outline" onClick={() => navigate('/grounding')}>
          {t('home.hardTime')}
        </BigButton>
      </div>

      <div className="flex items-center justify-center gap-6 text-base text-muted">
        <button
          type="button"
          onClick={() => navigate('/help')}
          className="tap flex items-center gap-2 rounded-2xl px-3 py-2
            transition-colors duration-200 ease-calm hover:text-cream"
        >
          <Icon name="help" size={20} />
          <span>{t('common.help')}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/entries')}
          className="tap flex items-center gap-2 rounded-2xl px-3 py-2
            transition-colors duration-200 ease-calm hover:text-cream"
        >
          <Icon name="list" size={20} />
          <span>{t('common.pastEntries')}</span>
        </button>
      </div>
    </ScreenShell>
  )
}
