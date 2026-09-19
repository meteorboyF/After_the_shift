import { useSettings } from '../store/settings.js'
import { useT } from '../lib/useT.js'
import { tapFeedback } from '../lib/haptics.js'
import Icon from './Icon.jsx'

/**
 * Bangla is the primary language; this is the secondary toggle. The label shows
 * the language you'd switch *to*, so it reads as a destination rather than a
 * setting you have to understand.
 */
export default function LanguageToggle({ className = '' }) {
  const toggleLang = useSettings((s) => s.toggleLang)
  const { t } = useT()

  return (
    <button
      type="button"
      onClick={() => {
        tapFeedback()
        toggleLang()
      }}
      className={`tap flex items-center gap-2 rounded-2xl px-3 py-2 text-base text-muted
        transition-colors duration-200 ease-calm hover:text-cream ${className}`}
    >
      <Icon name="globe" size={20} />
      <span>{t('common.otherLanguage')}</span>
    </button>
  )
}
