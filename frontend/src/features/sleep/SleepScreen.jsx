import { useNavigate } from 'react-router-dom'
import { BedDouble, Coffee, Home, MoonStar, Wind } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import Button from '../../components/Button.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useNow } from '../../lib/clock.js'
import { shiftState } from '../../lib/roster.js'
import { relativeDay } from '../../lib/format.js'

/**
 * 5.10 Rotation sleep plan — shown when a day/night switch is coming.
 * Research: AASM shift-work guidance (no caffeine in the second half of a
 * shift; sleep soon after a night shift), prophylactic 60–90 min nap before the
 * first night, and the 3–5 am circadian low (P1: fatigue hits at 3–4 am).
 * General information only. No sleep tracking, no scoring.
 */
const DAY = 86_400_000

function planFor(kind) {
  // [start, end] hours on a 0–24 bar. Blocks: s = sleep, n = nap, w = work.
  if (kind === 'NIGHT') {
    return [
      [{ s: [0.5, 9] }],
      [{ n: [15.5, 17] }, { w: [19, 24] }],
      [{ w: [0, 7] }, { s: [8, 15] }, { w: [19, 24] }, { hard: [3, 5] }],
    ]
  }
  return [
    [{ w: [0, 7] }, { s: [8, 12] }, { s: [21.5, 24] }],
    [{ s: [0, 5.5] }, { w: [7, 19] }, { s: [22, 24] }],
    [{ s: [0, 6] }, { w: [7, 19] }],
  ]
}

const TONE = {
  s: 'bg-zone-super/45',
  n: 'border-2 border-dashed border-zone-super bg-zone-super/15',
  w: 'bg-amber',
  hard: 'z-10 border-2 border-cream bg-[repeating-linear-gradient(135deg,rgba(18,21,31,0.75)_0_3px,transparent_3px_7px)]',
}

export default function SleepScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const now = useNow()
  const anchor = useApp((s) => s.anchor)
  if (!anchor) return <Screen zone="mine" back="/" />
  const rotation = shiftState(anchor, now).rotation

  const tips = [
    { icon: BedDouble, key: 'tipNap' },
    { icon: Home, key: 'tipHome' },
    { icon: Coffee, key: 'tipTea' },
    { icon: MoonStar, key: 'tipDark' },
  ]

  return (
    <Screen zone="mine" back="/">
      <Heading className="mt-2">{t('sleep.heading')}</Heading>
      <p className="mt-1 text-body text-sand">
        {rotation ? (rotation.kind === 'NIGHT' ? t('sleep.subNight') : t('sleep.subDay')) : t('sleep.noFlip')}
      </p>

      {rotation && (
        <section className="surface mt-5 p-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-body text-sand" aria-hidden="true">
            <Legend tone={TONE.s} label={t('sleep.sleep')} />
            <Legend tone={TONE.n} label={t('sleep.nap')} />
            <Legend tone={TONE.w} label={t('sleep.shift')} />
          </div>
          <ol className="mt-4 flex flex-col gap-4">
            {planFor(rotation.kind).map((blocks, i) => {
              const date = new Date(rotation.start.getTime() + (i - 1) * DAY)
              return (
                <li key={i}>
                  <p className="text-label text-cream">{relativeDay(date, now, lang)}</p>
                  <div className="relative mt-1 h-9 overflow-hidden rounded-2xl bg-ink-raised">
                    {blocks.map((b, j) => {
                      const [type, [a, z]] = Object.entries(b)[0]
                      return (
                        <span
                          key={j}
                          className={`absolute inset-y-1 rounded-xl ${TONE[type]}`}
                          style={{ left: `${(a / 24) * 100}%`, width: `${((z - a) / 24) * 100}%` }}
                          title={type}
                        />
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="mt-1 flex justify-between text-[18px] text-sand" aria-hidden="true">
            <span>{t('sleep.midnight')}</span>
            <span>{t('sleep.noon')}</span>
            <span>{t('sleep.midnight')}</span>
          </div>

          {rotation.kind === 'NIGHT' && (
            <div className="mt-4 border-t border-ink-line/70 pt-4">
              <p className="flex items-center gap-2 text-label text-cream">
                <span className="h-4 w-6 rounded border-2 border-cream bg-[repeating-linear-gradient(135deg,rgba(18,21,31,0.75)_0_3px,transparent_3px_7px)]" aria-hidden="true" />
                {t('sleep.hardest')}
              </p>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  icon={Wind}
                  label={t('sleep.hardestLink')}
                  sub={t('home.hardTime')}
                  onClick={() => navigate('/grounding', { state: { from: '/sleep' } })}
                />
              </div>
            </div>
          )}
        </section>
      )}

      <section className="mt-6">
        <h2 className="px-1 text-label text-cream">{t('sleep.tipsHeading')}</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {tips.map(({ icon: Icon, key }) => (
            <li key={key} className="surface flex items-center gap-4 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber-glow">
                <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-label leading-snug text-cream">{t(`sleep.${key}`)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 px-1 text-body text-sand">{t('sleep.disclaimer')}</p>
      </section>
    </Screen>
  )
}

function Legend({ tone, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-6 rounded ${tone}`} />
      {label}
    </span>
  )
}
