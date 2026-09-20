import { useNavigate } from 'react-router-dom'
import { useSettings } from '../store/settings.js'
import { useT } from '../lib/useT.js'
import { tapFeedback } from '../lib/haptics.js'
import Icon from './Icon.jsx'

/**
 * A way back to the demo launcher from any screen.
 *
 * Without it, a presenter who walks into Task 2 has no route to Task 3 except
 * finishing a check-in first — which is correct for a guard and useless on
 * stage.
 *
 * Deliberately muted and small so it never competes with the screen's own
 * primary action, and it is absent from the grounding exercise entirely: that
 * screen must stay empty apart from its full-size Stop control.
 */
export default function DemoChip() {
  const navigate = useNavigate()
  const { t } = useT()
  const demoMode = useSettings((s) => s.demoMode)
  const returnToDemo = useSettings((s) => s.returnToDemo)

  if (!demoMode) return null

  return (
    <button
      type="button"
      onClick={() => {
        tapFeedback()
        returnToDemo()
        navigate('/demo')
      }}
      className="flex items-center gap-1.5 rounded-full border border-muted/25 px-3 py-1.5
        text-sm text-muted transition-colors duration-200 ease-calm
        hover:border-amber/40 hover:text-amber"
    >
      <Icon name="list" size={16} />
      <span>{t('demo.backToDemo')}</span>
    </button>
  )
}
