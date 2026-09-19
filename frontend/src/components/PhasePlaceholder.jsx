import { useNavigate } from 'react-router-dom'
import ScreenShell from './ScreenShell.jsx'
import BigButton from './BigButton.jsx'
import Icon from './Icon.jsx'
import { useT } from '../lib/useT.js'

/**
 * Temporary. Holds a route that a later phase fills in, so navigation is real
 * from Phase 1 onward instead of being stubbed with dead links.
 *
 * Delete this component once Phases 2–4 have landed.
 */
export default function PhasePlaceholder({ title, guard = 'walking' }) {
  const navigate = useNavigate()
  const { t } = useT()

  return (
    <ScreenShell guard={guard} guardOpacity={0.22} onBack={() => navigate(-1)} backLabel={t('common.back')}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Icon name="lamp" size={36} className="text-amber/70" />
        <h1 className="measure text-label-lg font-semibold text-cream">{title}</h1>
        <p className="text-base text-muted">{t('common.soon')}</p>
      </div>

      <BigButton variant="quiet" onClick={() => navigate('/')}>
        {t('common.back')}
      </BigButton>
    </ScreenShell>
  )
}
