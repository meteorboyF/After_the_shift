import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clear as idbClear } from 'idb-keyval'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import LanguageToggle from '../../components/LanguageToggle.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useSettings } from '../../store/settings.js'
import { stagger } from '../../lib/motion.js'
import { tapFeedback } from '../../lib/haptics.js'

/**
 * The demo launcher. Scaffolding, not product.
 *
 * Two problems it solves. First impression: the hosted link used to open on a
 * bare PIN keypad — no title, no explanation, nothing telling a visitor what
 * they were looking at. Second, reachability: the spec puts the supervisor view
 * "behind a demo toggle" and there was no toggle, so that view and Task 3 could
 * not be reached from the interface at all.
 *
 * It deliberately changes nothing inside the guard's experience. Every task
 * entry below starts the real flow at its real first screen.
 */

const TASKS = [
  { key: 'task1', icon: 'mic', to: '/', badge: '1' },
  { key: 'task2', icon: 'breathe', to: '/grounding', badge: '2' },
  { key: 'task3', icon: 'clock', to: '/relief', badge: '3' },
]

// Only screens that stand on their own. 1C and 3B/3C need a recording or a
// draft in flight, so they are reached by walking the flow, not linked here.
const SCREENS = [
  { key: 'home', icon: 'lamp', to: '/' },
  { key: 'entries', icon: 'list', to: '/entries' },
  { key: 'summary', icon: 'tick', to: '/checkin/saved' },
  { key: 'breathing', icon: 'breathe', to: '/grounding/breathing' },
  { key: 'helpScreen', icon: 'help', to: '/help' },
]

export default function DemoIndexScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const startDemo = useSettings((s) => s.startDemo)
  const showPinScreen = useSettings((s) => s.showPinScreen)

  const go = (to) => {
    tapFeedback()
    startDemo()
    navigate(to)
  }

  const openPin = () => {
    tapFeedback()
    showPinScreen()
    navigate('/')
  }

  const reset = async () => {
    tapFeedback()
    await idbClear()
    localStorage.clear()
    window.location.reload()
  }

  return (
    <ScreenShell scrollable guard="night_post" guardOpacity={0.16} topRight={<LanguageToggle />}>
      <div className="mt-2">
        <p className="text-sm uppercase tracking-[0.22em] text-amber">{t('demo.kicker')}</p>
        <h1 className="mt-2 text-display font-semibold leading-tight text-cream">
          {t('demo.title')}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">{t('demo.subtitle')}</p>
      </div>

      <div className="mt-7">
        <BigButton icon="mic" onClick={() => go('/')}>
          {t('demo.start')}
        </BigButton>
        <p className="mt-2 text-center text-sm text-muted">{t('demo.startHint')}</p>
      </div>

      <p className="mt-9 text-sm uppercase tracking-[0.18em] text-muted">
        {t('demo.tasksHeading')}
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {TASKS.map((task, index) => (
          <motion.button
            key={task.key}
            type="button"
            {...stagger(false, index)}
            onClick={() => go(task.to)}
            className="tap flex items-center gap-4 rounded-3xl bg-ink-soft/85 p-4 text-left
              transition-colors duration-200 ease-calm hover:bg-ink-raised"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber/12 text-amber">
              <Icon name={task.icon} size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-label leading-snug text-cream">{t(`demo.${task.key}`)}</span>
              <span className="mt-0.5 block text-sm text-muted">{t(`demo.${task.key}Sub`)}</span>
            </span>
            <span className="text-label-lg font-semibold text-amber/50">{task.badge}</span>
          </motion.button>
        ))}
      </div>

      <p className="mt-8 text-sm uppercase tracking-[0.18em] text-muted">
        {t('demo.screensHeading')}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {SCREENS.map((screen) => (
          <button
            key={screen.key}
            type="button"
            onClick={() => go(screen.to)}
            className="tap flex items-center gap-2.5 rounded-2xl bg-ink-soft/70 px-3 py-3 text-left
              transition-colors duration-200 ease-calm hover:bg-ink-raised"
          >
            <Icon name={screen.icon} size={20} className="shrink-0 text-amber/70" />
            <span className="text-base leading-snug text-cream">{t(`demo.${screen.key}`)}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={openPin}
          className="tap flex items-center gap-2.5 rounded-2xl bg-ink-soft/70 px-3 py-3 text-left
            transition-colors duration-200 ease-calm hover:bg-ink-raised"
        >
          <Icon name="lamp" size={20} className="shrink-0 text-amber/70" />
          <span className="text-base leading-snug text-cream">{t('demo.pin')}</span>
        </button>
      </div>

      {/* Kept visually apart: this is the other side of the wall, not a guard screen. */}
      <button
        type="button"
        onClick={() => go('/supervisor')}
        className="tap mt-4 flex w-full items-center gap-4 rounded-3xl border-2 border-warn/35
          bg-warn/5 p-4 text-left transition-colors duration-200 ease-calm hover:border-warn/60"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warn/12 text-warn">
          <Icon name="swap" size={24} />
        </span>
        <span className="min-w-0">
          <span className="block text-label leading-snug text-cream">{t('demo.supervisor')}</span>
          <span className="mt-0.5 block text-sm text-muted">{t('demo.supervisorHint')}</span>
        </span>
      </button>

      <div className="mt-8 flex flex-col gap-2 pb-2">
        <BigButton variant="quiet" icon="cross" onClick={reset}>
          {t('demo.reset')}
        </BigButton>
        <p className="text-center text-sm text-muted">{t('demo.resetHint')}</p>
      </div>

      <p className="mt-6 text-center text-sm text-muted">{t('demo.notClinical')}</p>
    </ScreenShell>
  )
}
