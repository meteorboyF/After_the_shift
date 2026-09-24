import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, FileText, Lock, Moon, Sun } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import Button from '../../components/Button.jsx'
import Stepper from '../../components/Stepper.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useMine } from '../../store/mine.js'
import { useNow } from '../../lib/clock.js'
import { num, relativeDay } from '../../lib/format.js'
import {
  LEGAL_MAX_WEEK,
  STANDARD_WEEK,
  monthOvertime,
  overtimePay,
  weekRows,
  weekStart,
  weekTotal,
} from '../../lib/ledger.js'
import { hoursText, taka } from './format.js'

/**
 * 5.3 Hours ledger — the answer to P2 (would speak up only if the contract were
 * broken, but keeps no record) and P7 (banks rest days for months). MINE zone:
 * never synced, never sent. Numbers only, never alarmist.
 */
const SCALE = 84 // seven 12-hour days

export default function HoursScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const now = useNow()
  const anchor = useApp((s) => s.anchor)
  const mine = useMine()
  const [which, setWhich] = useState('this')

  useEffect(() => {
    mine.load(anchor)
  }, [anchor]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!anchor || !mine.loaded) return <Screen zone="mine" tabs />

  const start = weekStart(now)
  const shown = which === 'this' ? start : new Date(start.getTime() - 7 * 86_400_000)
  const rows = weekRows(anchor, mine, shown, now)
  const total = weekTotal(rows)
  const month = monthOvertime(anchor, mine, now)
  const pay = overtimePay(mine.basicPay, month.overtime)
  const over = total > LEGAL_MAX_WEEK

  return (
    <Screen zone="mine" tabs lamp={0.9}>
      <Heading className="mt-2">{t('hours.heading')}</Heading>
      <p className="mt-1 flex items-center gap-2 text-body text-sand">
        <Lock size={18} strokeWidth={2} className="text-zone-mine" aria-hidden="true" />
        {t('hours.private')}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-4xl bg-ink-soft p-1.5" role="tablist">
        {['this', 'last'].map((w) => (
          <button
            key={w}
            type="button"
            role="tab"
            aria-selected={which === w}
            onClick={() => setWhich(w)}
            className={`min-h-tap rounded-3xl text-label transition-colors duration-300 ${
              which === w ? 'bg-ink-raised font-semibold text-cream shadow-lift' : 'text-sand hover:text-cream'
            }`}
          >
            {w === 'this' ? t('hours.thisWeek') : t('hours.lastWeek')}
          </button>
        ))}
      </div>

      {/* The week, against the law's two lines */}
      <section className="surface mt-3 p-5">
        <p className="text-label-lg font-semibold leading-snug text-cream">
          {which === 'this' ? t('hours.whenThis') : t('hours.whenLast')} {hoursText(total, t, lang)}
        </p>
        <p className={`text-body ${over ? 'text-warn' : 'text-sand'}`}>{t('hours.limitLine')}</p>

        <div className="relative mt-8 h-5 rounded-full bg-ink-raised" role="img" aria-label={`${hoursText(total, t, lang)} / ${num(LEGAL_MAX_WEEK, lang)}`}>
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-amber transition-[width] duration-500 ease-calm"
            style={{ width: `${Math.min(100, (Math.min(total, LEGAL_MAX_WEEK) / SCALE) * 100)}%` }}
          />
          {over && (
            <div
              className="absolute inset-y-0 rounded-r-full bg-warn"
              style={{ left: `${(LEGAL_MAX_WEEK / SCALE) * 100}%`, width: `${((Math.min(total, SCALE) - LEGAL_MAX_WEEK) / SCALE) * 100}%` }}
            />
          )}
          {[STANDARD_WEEK, LEGAL_MAX_WEEK].map((mark) => (
            <span key={mark} className="absolute -top-7 flex -translate-x-1/2 flex-col items-center" style={{ left: `${(mark / SCALE) * 100}%` }}>
              <span className="text-[18px] leading-none tabular-nums text-sand">{num(mark, lang)}</span>
              <span className="mt-1 h-11 w-0.5 bg-cream/70" />
            </span>
          ))}
        </div>
        <p className="mt-4 text-body text-sand">{t('hours.limitNote')}</p>
      </section>

      {/* Day by day */}
      <section className="mt-6">
        <h2 className="px-1 text-label text-cream">{t('hours.daysHeading')}</h2>
        <p className="px-1 text-body text-sand">{t('hours.daysHint')}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {rows.map((r) => (
            <DayRow key={r.id} r={r} now={now} />
          ))}
        </ul>
      </section>

      {/* The month */}
      <section className="surface mt-6 p-5">
        <h2 className="text-label text-cream">{t('hours.monthHeading')}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-ink-raised/70 p-4">
            <dt className="text-body text-sand">{t('hours.overtime')}</dt>
            <dd className="text-label-lg font-semibold text-cream">{t('hours.overtimeN', { n: month.overtime })}</dd>
          </div>
          <div className="rounded-3xl bg-ink-raised/70 p-4">
            <dt className="text-body text-sand">{t('hours.restWorkedLabel')}</dt>
            <dd className="text-label-lg font-semibold text-cream">{t('hours.restWorkedN', { n: month.restDaysWorked })}</dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-ink-line/70 pt-4">
          <p className="text-body text-sand">{t('hours.payHeading')}</p>
          {mine.basicPay ? (
            <>
              <p className="text-hero font-semibold leading-tight tabular-nums text-amber-glow">৳ {taka(pay, lang)}</p>
              <p className="text-body text-sand">{t('hours.payFormula')}</p>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-body text-sand">{t('hours.basic')}</span>
                <Stepper
                  value={`৳ ${taka(mine.basicPay, lang)}`}
                  onMinus={() => mine.setBasicPay(Math.max(1000, mine.basicPay - 500))}
                  onPlus={() => mine.setBasicPay(mine.basicPay + 500)}
                  minusLabel={t('hours.lessPay')}
                  plusLabel={t('hours.morePay')}
                />
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-label text-cream">{t('hours.payNeedsBasic')}</p>
              <div className="mt-3">
                <Button variant="secondary" label={t('hours.setBasic')} onClick={() => mine.setBasicPay(10000)} />
              </div>
            </>
          )}
        </div>
        <p className="mt-4 text-body text-sand">{t('hours.disclaimer')}</p>
      </section>

      <div className="mt-4">
        <Button variant="secondary" icon={FileText} label={t('hours.export')} onClick={() => navigate('/hours/summary')} />
      </div>
    </Screen>
  )
}

function DayRow({ r, now }) {
  const { t, lang } = useT()
  const mine = useMine()
  const name = relativeDay(r.day, now, lang)
  const Icon = r.kind === 'DAY' ? Sun : r.kind === 'NIGHT' ? Moon : null

  if (r.kind === 'REST') {
    const worked = Boolean(mine.restWorked[r.id])
    return (
      <li className="surface p-3 pl-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-label text-cream">
            {name} <span className="text-sand">{num(r.day.getDate(), lang)}</span>
          </span>
          <span className="text-body text-sand">{worked ? hoursText(r.hours, t, lang) : t('hours.restDay')}</span>
        </div>
        {!r.future && (
          <button
            type="button"
            role="switch"
            aria-checked={worked}
            onClick={() => mine.toggleRestWorked(r.id)}
            className="mt-2 flex min-h-tap w-full items-center gap-3 rounded-3xl px-2 text-left text-label text-cream"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 ${worked ? 'border-amber bg-amber text-ink' : 'border-ink-line'}`}>
              {worked && <Check size={22} strokeWidth={3} aria-hidden="true" />}
            </span>
            {t('hours.restWorked')}
          </button>
        )}
      </li>
    )
  }

  if (r.kind === 'LEAVE') return null

  return (
    <li className="surface p-3 pl-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-label text-cream">
          {Icon && <Icon size={20} strokeWidth={2} className="text-amber-glow" aria-hidden="true" />}
          {name} <span className="text-sand">{num(r.day.getDate(), lang)}</span>
        </span>
        {r.future && <span className="text-body text-sand">{t('hours.upcoming')}</span>}
        {r.running && <span className="rounded-full bg-amber/15 px-3 text-body text-amber-text">{t('hours.running')}</span>}
      </div>
      {!r.future && (
        <div className="mt-2 flex justify-end">
          <Stepper
            value={hoursText(r.hours, t, lang)}
            onMinus={() => mine.nudge(r.id, -30)}
            onPlus={() => mine.nudge(r.id, 30)}
            minusLabel={t('hours.minus')}
            plusLabel={t('hours.plus')}
            disabledMinus={r.hours <= 0}
          />
        </div>
      )}
    </li>
  )
}
