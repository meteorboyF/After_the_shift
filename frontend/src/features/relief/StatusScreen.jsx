import { useLocation, useNavigate } from 'react-router-dom'
import { Check, Plus, Undo2 } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { useNow } from '../../lib/clock.js'
import { monthTally } from '../../lib/relief.js'
import { STATUS_TONE, TYPE_META, ago } from './common.jsx'

/**
 * 3D — status and the monthly tally. The tally is the answer to P7: proof the
 * app does something. Only a WAITING request can be withdrawn, and a withdrawn
 * one stays in history (audit B6). "Not this time" is warm orange, never red,
 * and never asks for a justification.
 */
export default function StatusScreen() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { t } = useT()
  const now = useNow()
  const relief = useApp((s) => s.relief)
  const withdraw = useApp((s) => s.withdrawRelief)
  const tally = monthTally(relief, now)
  const sorted = [...relief].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const open = sorted.filter((r) => r.status === 'PENDING')
  const past = sorted.filter((r) => r.status !== 'PENDING')

  return (
    <Screen zone="super" back="/">
      <Heading className="mt-2">{t('relief.statusHeading')}</Heading>

      <div className="surface mt-5 flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ok/15 text-ok">
          <Check size={30} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-label-lg font-semibold leading-snug text-cream">{t('relief.tallyAsked', { n: tally.asked })}</span>
          <span className="text-label text-ok">{t('relief.tallyAccepted', { n: tally.accepted })}</span>
        </span>
      </div>

      {open.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3">
          {open.map((r) => (
            <li key={r.id} className={`surface p-4 ${state?.justSent === r.id ? 'border-amber/60' : ''}`}>
              <Row r={r} now={now} highlight={state?.justSent === r.id} />
              <button
                type="button"
                onClick={() => withdraw(r.id)}
                className="mt-3 flex min-h-tap w-full items-center justify-center gap-2 rounded-3xl border border-ink-line text-label text-sand transition-colors hover:border-sand hover:text-cream"
              >
                <Undo2 size={22} strokeWidth={1.75} aria-hidden="true" />
                {t('relief.withdraw')}
              </button>
            </li>
          ))}
        </ul>
      )}

      {past.length > 0 && (
        <section className="mt-6">
          <h2 className="px-1 text-label text-sand">{t('relief.earlier')}</h2>
          <ul className="mt-2 flex flex-col divide-y divide-ink-line/60">
            {past.map((r) => (
              <li key={r.id} className="py-3">
                <Row r={r} now={now} compact />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Button variant="primary" icon={Check} label={t('relief.ok')} onClick={() => navigate('/')} />
        <Button variant="secondary" icon={Plus} label={t('relief.newRequest')} onClick={() => navigate('/relief')} />
      </div>
    </Screen>
  )
}

function Row({ r, now, compact = false, highlight = false }) {
  const { t } = useT()
  const meta = TYPE_META[r.type]
  const Icon = meta.icon
  return (
    <div className="flex items-center gap-3">
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-ink-raised text-amber-glow ${compact ? 'h-11 w-11' : 'h-14 w-14'}`}>
        <Icon size={compact ? 22 : 28} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-label leading-snug text-cream">{t(`relief.${meta.key}`)}</span>
        <span className="text-body text-sand">{highlight ? t('relief.sentNow') : ago(new Date(r.createdAt), now, t)}</span>
      </span>
      <span className={`shrink-0 rounded-full px-3 py-1 text-body font-medium ${STATUS_TONE[r.status]}`}>{t(`relief.${r.status}`)}</span>
    </div>
  )
}
