import { useEffect } from 'react'
import { Download, Lock } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import Button from '../../components/Button.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useMine } from '../../store/mine.js'
import { useNow } from '../../lib/clock.js'
import { num, relativeDay } from '../../lib/format.js'
import { monthOvertime, overtimePay, weekRows, weekStart, weekTotal } from '../../lib/ledger.js'
import { hoursText, taka } from './format.js'

/**
 * The export: a plain, dated summary the guard can keep or show someone.
 * Never sent anywhere automatically — saving it is his own act.
 */
export default function SummaryScreen() {
  const { t, lang } = useT()
  const now = useNow()
  const anchor = useApp((s) => s.anchor)
  const mine = useMine()
  useEffect(() => {
    mine.load(anchor)
  }, [anchor]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!anchor || !mine.loaded) return <Screen zone="mine" back="/hours" />

  const thisStart = weekStart(now)
  const weeks = [new Date(thisStart.getTime() - 7 * 86_400_000), thisStart].map((s) => {
    const rows = weekRows(anchor, mine, s, now).filter((r) => r.hours > 0)
    return { start: s, rows, total: weekTotal(rows) }
  })
  const month = monthOvertime(anchor, mine, now)
  const pay = overtimePay(mine.basicPay, month.overtime)
  const date = now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const lines = [
    t('hours.summaryHeading'),
    t('hours.summaryMade', { date }),
    '',
    ...weeks.flatMap((w, i) => [
      `${i === 0 ? t('hours.lastWeek') : t('hours.thisWeek')}: ${hoursText(w.total, t, lang)}`,
      ...w.rows.map((r) => `  ${relativeDay(r.day, now, lang)} ${num(r.day.getDate(), lang)}: ${hoursText(r.hours, t, lang)}`),
      '',
    ]),
    `${t('hours.monthHeading')}: ${t('hours.overtime')} ${t('hours.overtimeN', { n: month.overtime })}, ${t('hours.restWorkedLabel')} ${t('hours.restWorkedN', { n: month.restDaysWorked })}`,
    pay != null ? `${t('hours.payHeading')}: ৳ ${taka(pay, lang)}` : '',
    '',
    t('hours.limitNote'),
    t('hours.disclaimer'),
  ]

  const saveFile = () => {
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hours-${now.toISOString().slice(0, 10)}.txt`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  return (
    <Screen zone="mine" back="/hours">
      <Heading className="mt-2">{t('hours.summaryHeading')}</Heading>
      <p className="mt-1 flex items-center gap-2 text-body text-sand">
        <Lock size={18} strokeWidth={2} className="text-zone-mine" aria-hidden="true" />
        {t('hours.notSent')}
      </p>

      {/* A sheet of paper: readable in sunlight, easy to show. */}
      <article className="mt-5 rounded-4xl bg-cream p-5 text-ink shadow-glow">
        <p className="text-body text-ink/80">{t('hours.summaryMade', { date })}</p>
        {weeks.map((w, i) => (
          <section key={i} className="mt-4 border-t border-ink/15 pt-3">
            <h2 className="flex justify-between text-label font-semibold">
              <span>{i === 0 ? t('hours.lastWeek') : t('hours.thisWeek')}</span>
              <span className="tabular-nums">{hoursText(w.total, t, lang)}</span>
            </h2>
            <ul className="mt-1">
              {w.rows.map((r) => (
                <li key={r.id} className="flex justify-between text-body tabular-nums">
                  <span>
                    {relativeDay(r.day, now, lang)} {num(r.day.getDate(), lang)}
                  </span>
                  <span>{hoursText(r.hours, t, lang)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="mt-4 border-t border-ink/15 pt-3 text-body">
          <p className="flex justify-between">
            <span>{t('hours.overtime')}</span>
            <span className="font-semibold">{t('hours.overtimeN', { n: month.overtime })}</span>
          </p>
          <p className="flex justify-between">
            <span>{t('hours.restWorkedLabel')}</span>
            <span className="font-semibold">{t('hours.restWorkedN', { n: month.restDaysWorked })}</span>
          </p>
          {pay != null && (
            <p className="flex justify-between">
              <span>{t('hours.payHeading')}</span>
              <span className="font-semibold">৳ {taka(pay, lang)}</span>
            </p>
          )}
        </section>
        <p className="mt-4 text-body text-ink/80">{t('hours.limitNote')}</p>
        <p className="text-body text-ink/80">{t('hours.disclaimer')}</p>
      </article>

      <div className="mt-5">
        <Button variant="primary" icon={Download} label={t('hours.saveFile')} onClick={saveFile} />
      </div>
    </Screen>
  )
}
