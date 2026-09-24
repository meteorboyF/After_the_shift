import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, House, MapPin, Moon, Sun, Users } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import Button from '../../components/Button.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useNow } from '../../lib/clock.js'
import { daysFrom, daysUntilLeave, NEIGHBOURS, POSTS } from '../../lib/roster.js'
import { clockTime, num, relativeDay, weekday } from '../../lib/format.js'

/**
 * 5.2 Roster + 5.4 leave counter. The roster comes from the supervisor and is
 * read-only here (SUPERVISOR zone badge). Guards have no choice in allocation
 * and rotate weekly between day and night (P1–P8; Teynampet study).
 */
const PILL = {
  DAY: 'bg-amber text-ink',
  NIGHT: 'bg-ink-raised text-amber-glow border border-amber/25',
  REST: 'bg-ink-soft text-sand border border-dashed border-ink-line',
  LEAVE: 'bg-ok/15 text-ok border border-ok/40',
}
const ICON = { DAY: Sun, NIGHT: Moon, REST: null, LEAVE: House }

export default function RosterScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const now = useNow()
  const anchor = useApp((s) => s.anchor)
  const [selected, setSelected] = useState(0)
  const strip = useRef(null)

  useEffect(() => {
    strip.current?.scrollTo?.({ left: 0 })
  }, [])

  if (!anchor) return <Screen zone="super" tabs />

  const days = daysFrom(anchor, now, 14)
  const day = days[selected]
  const workKinds = (d) => d.kind === 'DAY' || d.kind === 'NIGHT'
  const leaveIn = daysUntilLeave(anchor, now)
  const leaveStart = new Date(anchor.leaveStart)
  const DayIcon = ICON[day.kind]

  return (
    <Screen zone="super" tabs lamp={0.9}>
      <Heading className="mt-2">{t('roster.heading')}</Heading>
      <p className="mt-1 text-body text-sand">{t('roster.sub')}</p>

      {/* 14-day strip */}
      <div ref={strip} className="-mx-4 mt-4 overflow-x-auto px-5 pb-3 pt-2 [scrollbar-width:none]" role="listbox" aria-label={t('roster.heading')}>
        <ol className="flex w-max items-end gap-2">
          {days.map((d, i) => {
            const prevWork = days.slice(0, i).reverse().find(workKinds)
            const flip = workKinds(d) && prevWork && prevWork.kind !== d.kind
            const Icon = ICON[d.kind]
            const isSel = i === selected
            return (
              <li key={d.id} className="flex items-end">
                {flip && (
                  <span className="mx-1.5 h-[132px] w-0.5 self-start rounded-full bg-amber/60" aria-hidden="true" />
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  onClick={() => setSelected(i)}
                  aria-label={`${relativeDay(d.day, now, lang)}, ${t(`roster.kind.${d.kind}`)}`}
                  className="flex w-16 flex-col items-center gap-1.5"
                >
                  <span className={`h-6 whitespace-nowrap text-[18px] leading-6 ${flip ? 'text-amber-text' : 'text-transparent'}`} aria-hidden="true">
                    {flip ? t(`roster.flipTo.${d.kind}`) : '·'}
                  </span>
                  <span
                    className={`flex h-24 w-14 flex-col items-center justify-center rounded-full transition-[outline-color] duration-300 ${PILL[d.kind]}
                      ${isSel ? 'outline outline-2 outline-offset-4 outline-amber-glow' : 'outline outline-2 outline-offset-4 outline-transparent'}`}
                  >
                    {Icon && <Icon size={24} strokeWidth={2} aria-hidden="true" />}
                  </span>
                  <span className={`text-[18px] leading-tight ${i === 0 ? 'font-semibold text-cream' : 'text-sand'}`}>
                    {i === 0 ? t('roster.today') : weekday(d.day, lang)}
                  </span>
                  <span className="text-[18px] leading-none tabular-nums text-sand">{num(d.day.getDate(), lang)}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Selected day */}
      <section className="surface mt-4 p-5" aria-live="polite">
        <div className="flex items-center gap-3">
          {DayIcon && (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber-glow">
              <DayIcon size={26} strokeWidth={1.75} aria-hidden="true" />
            </span>
          )}
          <div className="flex flex-col">
            <span className="text-label-lg font-semibold leading-snug text-cream">{t(`roster.kind.${day.kind}`)}</span>
            <span className="text-body text-sand">{relativeDay(day.day, now, lang)}</span>
          </div>
        </div>

        {workKinds(day) ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-label text-cream">
                {clockTime(day.start, lang)} – {clockTime(day.end, lang)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber/10 px-3 py-0.5 text-body text-amber-text">
                <MapPin size={18} strokeWidth={2} aria-hidden="true" />
                {POSTS[day.post][lang]}
              </span>
            </div>
            <div className="mt-4 border-t border-ink-line/70 pt-3">
              <p className="flex items-center gap-2 text-body text-sand">
                <Users size={18} strokeWidth={2} className="text-zone-peers" aria-hidden="true" />
                {t('roster.neighbours')}
              </p>
              <ul className="mt-1 flex flex-col">
                {NEIGHBOURS[day.kind].map((n) => (
                  <li key={n.post} className="flex justify-between py-1 text-label text-cream">
                    <span>{n[lang]}</span>
                    <span className="text-sand">{POSTS[n.post][lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <Button
                variant="secondary"
                icon={ArrowLeftRight}
                label={t('roster.swapThis')}
                onClick={() => navigate('/swap', { state: { shiftId: day.id } })}
              />
            </div>
          </>
        ) : (
          <p className="mt-3 text-body text-sand">{day.kind === 'LEAVE' ? t('roster.leaveNote') : t('roster.restNote')}</p>
        )}
      </section>

      {/* Going home */}
      <section className="surface mt-4 p-5">
        <h2 className="flex items-center gap-2 text-body text-sand">
          <House size={18} strokeWidth={2} className="text-ok" aria-hidden="true" />
          {t('roster.leaveHeading')}
        </h2>
        <p className="mt-1 text-label-lg font-semibold leading-snug text-cream">{t('roster.leaveCount', { n: leaveIn })}</p>
        <div className="mt-3 flex gap-2" aria-hidden="true">
          {Array.from({ length: anchor.leaveDays }, (_, i) => (
            <span key={i} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ok/15 text-ok">
              <House size={22} strokeWidth={1.75} />
            </span>
          ))}
        </div>
        <p className="mt-3 text-body text-sand">
          {t('roster.leaveApproved', { n: anchor.leaveDays, from: `${num(leaveStart.getDate(), lang)} ${leaveStart.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB', { month: 'long' })}` })}
        </p>
      </section>
    </Screen>
  )
}
