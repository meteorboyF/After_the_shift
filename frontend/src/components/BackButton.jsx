import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../i18n/index.js'
import { useLongPress } from '../lib/useLongPress.js'

/** Top-left, where the language toggle sits on Home. `to` is a path or -1. */
export default function BackButton({ to = -1, label }) {
  const navigate = useNavigate()
  const { t } = useT()
  const text = label ?? t('back')
  const press = useLongPress(text)
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      {...press}
      className="tap -ml-3 flex items-center gap-1 px-2 text-[18px] text-sand transition-colors duration-300 ease-calm hover:text-cream"
    >
      <ChevronLeft size={28} strokeWidth={1.75} aria-hidden="true" />
      <span className="pt-0.5">{text}</span>
    </button>
  )
}
