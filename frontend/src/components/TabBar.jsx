import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, ClipboardList, Hourglass, House, Wind } from 'lucide-react'
import { useT } from '../i18n/index.js'
import { useLongPress } from '../lib/useLongPress.js'

/**
 * The app's four places, plus the one thing that must always be one tap away:
 * "এখন কষ্ট হচ্ছে" sits in the centre of the bar on every main screen.
 *
 * The bar is hidden inside flows (recording, the exercise, the relief preview)
 * so those screens stay focused on their one action.
 */
const TABS = [
  { to: '/', icon: House, key: 'home', match: (p) => p === '/' },
  { to: '/roster', icon: CalendarDays, key: 'roster', match: (p) => p.startsWith('/roster') },
  { to: '/grounding', icon: Wind, key: 'hard', centre: true, match: (p) => p.startsWith('/grounding') },
  { to: '/hours', icon: Hourglass, key: 'hours', match: (p) => p.startsWith('/hours') },
  { to: '/relief/status', icon: ClipboardList, key: 'requests', match: (p) => p.startsWith('/relief') },
]

export default function TabBar() {
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="menu"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-phone border-t border-ink-line/80 bg-ink/95 px-1 pb-[max(env(safe-area-inset-bottom),6px)] pt-1 backdrop-blur-md"
    >
      <ul className="grid grid-cols-[1fr_1fr_1.35fr_1fr_1fr] items-end">
        {TABS.map((tab) => (
          <li key={tab.key}>
            <TabItem tab={tab} active={tab.match(pathname)} from={pathname} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function TabItem({ tab, active, from }) {
  const navigate = useNavigate()
  const { t } = useT()
  const label = t(`tabs.${tab.key}`)
  const full = tab.centre ? t('home.hardTime') : label
  const press = useLongPress(full)
  const Icon = tab.icon

  if (tab.centre) {
    return (
      <button
        type="button"
        onClick={() => navigate(tab.to, { state: { from } })}
        {...press}
        aria-label={full}
        className="group flex w-full flex-col items-center gap-0.5 pb-1"
      >
        <span className="-mt-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber bg-ink-soft text-amber-glow shadow-glow transition-colors duration-300 group-hover:bg-ink-raised">
          <Icon size={30} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="whitespace-nowrap text-[18px] font-medium leading-tight text-amber-text">{label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate(tab.to)}
      {...press}
      aria-current={active ? 'page' : undefined}
      className={`relative flex min-h-[68px] w-full flex-col items-center justify-center gap-0.5 rounded-3xl transition-colors duration-300
        ${active ? 'text-cream' : 'text-sand hover:text-cream'}`}
    >
      {active && (
        <span aria-hidden="true" className="absolute top-0 h-1 w-8 rounded-full bg-amber-glow shadow-[0_0_14px_rgba(255,196,107,0.8)]" />
      )}
      <Icon size={28} strokeWidth={active ? 2 : 1.75} aria-hidden="true" className={active ? 'text-amber-glow' : ''} />
      <span className="whitespace-nowrap text-[18px] leading-tight">{label}</span>
    </button>
  )
}
