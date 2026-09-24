import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, ChevronRight, Clock, ListChecks, Umbrella } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useLongPress } from '../../lib/useLongPress.js'
import { num } from '../../lib/format.js'

/**
 * 3A. P8's own words — not renamed into generic categories. The relief guards
 * asked for is logistical, not expressive (Finding 6).
 */
const OPTIONS = [
  { type: 'REST_HALF_HOUR', key: 'rest', icon: Clock },
  { type: 'POST_CHANGE', key: 'change', icon: ArrowLeftRight },
  { type: 'SHADE_POST', key: 'shade', icon: Umbrella },
]

export default function NeedScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const setDraft = useApp((s) => s.setDraft)
  const relief = useApp((s) => s.relief)
  const pending = relief.filter((r) => r.status === 'PENDING').length

  return (
    <Screen zone="super" back="/">
      <Heading className="mt-2">{t('relief.heading')}</Heading>
      <p className="mt-1 text-label text-sand">{t('relief.noReason')}</p>

      <ul className="mt-6 flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <li key={o.type}>
            <Choice
              icon={o.icon}
              label={t(`relief.${o.key}`)}
              onClick={() => {
                setDraft({ type: o.type, reason: null })
                navigate('/relief/reason')
              }}
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => navigate('/relief/status')}
        className="mt-auto flex min-h-tap w-full items-center gap-3 rounded-4xl px-2 pt-6 text-left text-sand transition-colors duration-300 hover:text-cream"
      >
        <ListChecks size={26} strokeWidth={1.75} aria-hidden="true" />
        <span className="flex-1 text-label">{t('relief.myRequests')}</span>
        {pending > 0 && (
          <span className="rounded-full bg-amber/15 px-3 py-0.5 text-body font-medium text-amber-text">
            {t('relief.PENDING')} ({num(pending, lang)})
          </span>
        )}
        <ChevronRight size={24} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </Screen>
  )
}

function Choice({ icon: Icon, label, onClick }) {
  const press = useLongPress(label)
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      className="surface flex min-h-[104px] w-full items-center gap-5 px-5 text-left transition-[transform,border-color] duration-300 ease-calm hover:border-amber/40 active:scale-[0.985]"
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber-glow">
        <Icon size={32} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="text-label-lg font-semibold leading-snug text-cream">{label}</span>
    </button>
  )
}
