import { Languages } from 'lucide-react'
import { useT } from '../i18n/index.js'
import { useLang } from '../store/app.js'

export default function LangToggle() {
  const { t } = useT()
  const toggle = useLang((s) => s.toggle)
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('langToggleLabel')}
      className="tap -ml-2 flex items-center gap-2 px-2 text-[18px] text-sand transition-colors duration-300 ease-calm hover:text-cream"
    >
      <Languages size={22} strokeWidth={1.75} aria-hidden="true" />
      <span className="pt-0.5">{t('langToggle')}</span>
    </button>
  )
}
