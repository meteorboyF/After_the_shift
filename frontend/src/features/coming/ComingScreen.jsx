import { useNavigate } from 'react-router-dom'
import { Home, Hammer } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import { useT } from '../../i18n/index.js'

/**
 * A designed placeholder for screens that arrive in Phase 3–4, so no tap on
 * Home ever lands on nothing. Carries the zone its real screen will have.
 */
export default function ComingScreen({ zone = 'mine', title }) {
  const navigate = useNavigate()
  const { t, lang } = useT()
  return (
    <Screen zone={zone} lamp={0.7}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-raised text-amber-glow shadow-lift">
          <Hammer size={34} strokeWidth={1.75} aria-hidden="true" />
        </span>
        {title && (
          <h1 className={`${lang === 'bn' ? 'font-display' : 'font-serif'} text-title text-cream`}>{title}</h1>
        )}
        <p className="measure text-label text-sand">
          {t('coming.heading')}
          <br />
          {t('coming.body')}
        </p>
      </div>
      <Button variant="secondary" icon={Home} label={t('coming.back')} onClick={() => navigate('/')} />
    </Screen>
  )
}
