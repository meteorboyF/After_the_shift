import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  ChevronRight,
  Coffee,
  House,
  IdCard,
  ListMusic,
  Lock,
  MapPin,
  Mic,
  Moon,
  Sun,
} from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Tile from '../../components/Tile.jsx'
import HeatCard from '../heat/HeatCard.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import ShiftArc from './ShiftArc.jsx'
import { useT } from '../../i18n/index.js'
import { useNow } from '../../lib/clock.js'
import { useApp } from '../../store/app.js'
import { daysUntilLeave, NEIGHBOURS, POSTS, shiftState } from '../../lib/roster.js'
import { typicalRange } from '../../lib/heat.js'
import { clockTime, duration, relativeDay } from '../../lib/format.js'
import { useLongPress } from '../../lib/useLongPress.js'

/**
 * Screen 1A — the shift companion.
 *
 * The first screen is about the SHIFT, not about feelings (six of eight guards
 * rejected a wellbeing app; none rejected help with the job). The check-in is
 * here, but quiet — it rises only in the last hour of a shift and the first hour
 * after, when there is something to say. "এখন কষ্ট হচ্ছে" sits in the centre
 * of the tab bar, so it is one tap away from every main screen.
 *
 * Deliberately absent: greeting by name, stats about the guard, notification
 * badges, anything that asks how he feels.
 */
export default function HomeScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const now = useNow()
  const anchor = useApp((s) => s.anchor)
  const relief = useApp((s) => s.relief)

  if (!anchor) return <Screen zone="mine" tabs />

  const state = shiftState(anchor, now)
  const { phase, focus } = state
  const kind = focus?.kind ?? 'DAY'
  const rising = phase === 'lastHour' || phase === 'justEnded'

  const heading =
    phase === 'on'
      ? t(`home.headingOn.${kind}`)
      : phase === 'lastHour'
        ? t('home.headingLast')
        : phase === 'justEnded'
          ? t('home.headingEnded')
          : t('home.headingOff')

  const scene =
    phase === 'justEnded' ? 'shift-end' : phase === 'off' ? 'resting' : kind === 'DAY' ? 'day-gate' : 'night-gate'

  const range = focus
    ? `${relativeDay(focus.start, now, lang)} ${clockTime(focus.start, lang)} – ${clockTime(focus.end, lang)}`
    : ''

  const countdown =
    phase === 'on' || phase === 'lastHour'
      ? { lead: t('home.endsIn', { d: '' }).trim(), value: duration(state.remainingMs, lang) }
      : phase === 'justEnded'
        ? { lead: null, value: t('home.endedAgo', { d: duration(state.sinceEndMs, lang) }) }
        : { lead: t('home.startsIn', { d: '' }).trim(), value: duration(state.untilStartMs, lang) }

  const pending = relief.filter((r) => r.status === 'PENDING').length
  const neighbours = NEIGHBOURS[kind].length
  const leaveIn = daysUntilLeave(anchor, now)
  // Heat card: day shifts only, hot months only, and only because he opened the app.
  const showHeat = kind === 'DAY' && (phase === 'on' || phase === 'lastHour') && typicalRange(now).hot
  const rotation = state.rotation && state.rotation.daysAway <= 3 && state.rotation.daysAway > 0 ? state.rotation : null

  return (
    <Screen
      zone="mine"
      scene={scene}
      sceneOpacity={0.3}
      lamp={kind === 'NIGHT' || phase === 'off' ? 1.1 : 0.75}
      tabs
    >
      <div className="mt-1 flex items-center justify-between gap-3">
        <h1
          className={`${lang === 'bn' ? 'font-display text-title' : 'font-serif text-[32px] font-semibold leading-tight'} text-cream`}
        >
          {heading}
        </h1>
        {focus?.post && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-amber/10 px-3 py-1 text-body font-medium text-amber-text">
            <MapPin size={18} strokeWidth={2} aria-hidden="true" />
            {POSTS[focus.post][lang]}
          </span>
        )}
      </div>

      {/* The shift */}
      <section className="surface mt-3 px-5 pb-1 pt-4" aria-label={heading}>
        <p className="text-label leading-snug text-cream">{range}</p>

        {rising ? (
          <div className="flex flex-col items-center pb-3 pt-3">
            <p className="text-body text-sand">
              {countdown.lead ? `${countdown.lead} ${countdown.value}` : countdown.value}
            </p>
            <VoiceButton
              label={t('home.checkinLoud')}
              sub={t('home.checkinPrivate')}
              onClick={() => navigate('/checkin')}
            />
          </div>
        ) : (
          <>
            <div className="mt-3">
              <ShiftArc progress={state.progress} kind={kind} />
            </div>
            <p className="mb-3 flex flex-wrap items-baseline justify-center gap-x-2 text-center">
              {countdown.lead && <span className="text-label text-sand">{countdown.lead}</span>}
              <span className="text-[28px] font-semibold leading-tight text-cream">{countdown.value}</span>
            </p>
            <div className="flex items-center gap-1 border-t border-ink-line/70">
              <QuietCheckIn
                label={t('home.checkinQuiet')}
                sub={t('home.checkinPrivate')}
                onClick={() => navigate('/checkin')}
              />
              <PastButton label={t('entries.heading')} onClick={() => navigate('/checkin/entries')} />
            </div>
          </>
        )}
      </section>

      {rotation && (
        <RotationNotice
          kind={rotation.kind}
          text={
            rotation.daysAway === 1
              ? t(`home.rotationTomorrow.${rotation.kind}`)
              : t(`home.rotation.${rotation.kind}`, { n: rotation.daysAway })
          }
          link={t('home.rotationLink')}
          onClick={() => navigate('/sleep')}
        />
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Tile
          icon={Coffee}
          label={t('home.tiles.relief')}
          fact={pending ? t('home.tileReliefPending', { n: pending }) : t('home.tileReliefNone')}
          zone="super"
          onClick={() => navigate('/relief')}
        />
        <Tile
          icon={ArrowLeftRight}
          label={t('home.tiles.swap')}
          fact={t('home.tileSwap', { n: neighbours })}
          zone="peers"
          onClick={() => navigate('/swap')}
        />
        <Tile
          icon={House}
          label={t('home.tiles.leave')}
          fact={t('home.tileLeave', { n: leaveIn })}
          zone="super"
          onClick={() => navigate('/roster')}
        />
        <Tile icon={IdCard} label={t('idcard.tile')} fact={t('idcard.tileFact')} onClick={() => navigate('/id')} />
      </div>

      {showHeat && <HeatCard shiftId={state.current.id} now={now} anchor={anchor} />}
    </Screen>
  )
}

/** The check-in, at rest: present, never pushing. */
function QuietCheckIn({ label, sub, onClick }) {
  const press = useLongPress(`${label}. ${sub}`)
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      className="-ml-2 flex min-w-0 flex-1 items-center gap-4 rounded-3xl px-2 py-2.5 text-left
        transition-colors duration-300 ease-calm hover:bg-ink-raised/50"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber/60 text-amber-glow">
        <Mic size={26} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-label font-medium leading-snug text-cream">{label}</span>
        <span className="flex items-center gap-1.5 text-body text-sand">
          <Lock size={16} strokeWidth={2} className="text-zone-mine" aria-hidden="true" />
          {sub}
        </span>
      </span>
    </button>
  )
}

function PastButton({ label, onClick }) {
  const press = useLongPress(label)
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      aria-label={label}
      className="-mr-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sand transition-colors duration-300 hover:bg-ink-raised/60 hover:text-cream"
    >
      <ListMusic size={26} strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}

function RotationNotice({ kind, text, link, onClick }) {
  const press = useLongPress(`${text}. ${link}`)
  const Icon = kind === 'NIGHT' ? Moon : Sun
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      className="mt-3 flex min-h-tap w-full items-center gap-3 rounded-4xl border border-amber/30 bg-amber/[0.07] px-4 py-2.5 text-left
        transition-colors duration-300 ease-calm hover:border-amber/60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-raised text-amber-glow">
        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-[20px] leading-snug text-cream">{text}</span>
        <span className="text-body leading-snug text-amber-text">{link}</span>
      </span>
      <ChevronRight size={22} strokeWidth={1.75} className="shrink-0 text-sand" aria-hidden="true" />
    </button>
  )
}

