import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowLeftRight, Building2, Check, Send, Timer, Users, X } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import Button from '../../components/Button.jsx'
import { useT } from '../../i18n/index.js'
import { useApp } from '../../store/app.js'
import { usePeers } from '../../store/peers.js'
import { useNow } from '../../lib/clock.js'
import { daysFrom, MY_POST, NEIGHBOURS, POSTS, shiftState } from '../../lib/roster.js'
import { clockTime, relativeDay } from '../../lib/format.js'

/**
 * 5.6 Swap post — PEERS zone. The offer goes only to the named colleague.
 * Only an agreed swap reaches the supervisor, and only as "post ↔ post, time".
 */
export default function SwapScreen() {
  const { t, lang } = useT()
  const now = useNow()
  const { state } = useLocation()
  const anchor = useApp((s) => s.anchor)
  const { swaps, load, offer, setStatus } = usePeers()
  const [whenId, setWhenId] = useState(state?.shiftId ?? null)
  const [whoPost, setWhoPost] = useState(null)

  useEffect(() => {
    load()
  }, [load])

  if (!anchor) return <Screen zone="peers" back="/" />

  const st = shiftState(anchor, now)
  const upcoming = daysFrom(anchor, now, 10)
    .filter((d) => (d.kind === 'DAY' || d.kind === 'NIGHT') && d.start > now)
    .slice(0, 3)
  const options = [
    ...(st.current
      ? [{ id: 'hour', kind: st.current.kind, start: now, end: new Date(now.getTime() + 3_600_000), label: t('swap.hourNow') }]
      : []),
    ...upcoming.map((d) => ({
      id: d.id,
      kind: d.kind,
      start: d.start,
      end: d.end,
      label: `${relativeDay(d.start, now, lang)} ${clockTime(d.start, lang)}`,
    })),
  ]
  const when = options.find((o) => o.id === whenId) ?? null
  const people = when ? NEIGHBOURS[when.kind] : []
  const who = people.find((p) => p.post === whoPost) ?? null
  const span = when ? `${clockTime(when.start, lang)} – ${clockTime(when.end, lang)}` : ''
  const pair = who ? `${POSTS[MY_POST][lang]} ↔ ${POSTS[who.post][lang]}` : ''

  const send = async () => {
    await offer({
      myPost: MY_POST,
      theirPost: who.post,
      colleague: { bn: who.bn, en: who.en },
      start: when.start.toISOString(),
      end: when.end.toISOString(),
    })
    setWhenId(null)
    setWhoPost(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Screen zone="peers" back="/">
      <Heading className="mt-2">{t('swap.heading')}</Heading>
      <p className="mt-1 text-body text-sand">{t('swap.sub')}</p>

      {swaps.length > 0 && (
        <section className="mt-5">
          <h2 className="px-1 text-label text-cream">{t('swap.myOffers')}</h2>
          <ul className="mt-2 flex flex-col gap-2">
            {swaps.slice(0, 3).map((s) => (
              <OfferRow key={s.id} s={s} onStatus={setStatus} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="px-1 text-label text-cream">{t('swap.when')}</h2>
        <div className="mt-2 flex flex-col gap-2">
          {options.map((o) => (
            <Choice
              key={o.id}
              selected={whenId === o.id}
              icon={o.id === 'hour' ? Timer : ArrowLeftRight}
              label={o.label}
              sub={o.id === 'hour' ? `${clockTime(o.start, lang)} – ${clockTime(o.end, lang)}` : t(`roster.kind.${o.kind}`)}
              onClick={() => {
                setWhenId(o.id)
                setWhoPost(null)
              }}
            />
          ))}
        </div>
      </section>

      {when && (
        <section className="mt-6 anim-rise">
          <h2 className="px-1 text-label text-cream">{t('swap.who')}</h2>
          <div className="mt-2 flex flex-col gap-2">
            {people.map((p) => (
              <Choice
                key={p.post}
                selected={whoPost === p.post}
                icon={Users}
                label={p[lang]}
                sub={POSTS[p.post][lang]}
                onClick={() => setWhoPost(p.post)}
              />
            ))}
          </div>
        </section>
      )}

      {when && who && (
        <section className="mt-6 anim-rise">
          <h2 className="px-1 text-label text-cream">{t('swap.seesTitle')}</h2>
          <div className="mt-2 rounded-4xl border-2 border-zone-peers/50 bg-ink-soft p-4">
            <p className="flex items-center gap-2 text-body text-zone-peers">
              <Users size={18} strokeWidth={2} aria-hidden="true" />
              {t('swap.colleagueSees', { name: who[lang] })}
            </p>
            <p className="mt-1 text-label font-semibold text-cream">{pair}</p>
            <p className="text-body text-sand">
              {when.id === 'hour' ? '' : `${relativeDay(when.start, now, lang)}, `}
              {span}
            </p>
          </div>
          <div className="mt-2 rounded-4xl border-2 border-zone-super/40 bg-ink-soft p-4">
            <p className="flex items-center gap-2 text-body text-zone-super">
              <Building2 size={18} strokeWidth={2} aria-hidden="true" />
              {t('swap.supervisorSees')}
            </p>
            <p className="mt-1 text-label text-cream">
              {pair}, {span}
            </p>
            <p className="text-body text-sand">{t('swap.noReason')}</p>
          </div>
        </section>
      )}

      <div className="mt-6">
        <Button variant="primary" icon={Send} label={when && who ? t('swap.send') : t('swap.pick')} onClick={send} disabled={!when || !who} className="disabled:bg-ink-raised disabled:text-sand disabled:shadow-none" />
      </div>
    </Screen>
  )
}

function Choice({ icon: Icon, label, sub, selected, onClick }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex min-h-[76px] w-full items-center gap-4 rounded-4xl border-2 px-4 text-left transition-colors duration-300 ${
        selected ? 'border-amber bg-amber/10' : 'border-ink-line bg-ink-soft hover:border-amber/40'
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-amber text-ink' : 'bg-ink-raised text-amber-glow'}`}>
        {selected ? <Check size={24} strokeWidth={2.5} aria-hidden="true" /> : <Icon size={22} strokeWidth={1.75} aria-hidden="true" />}
      </span>
      <span className="flex flex-col">
        <span className="text-label leading-snug text-cream">{label}</span>
        {sub && <span className="text-body text-sand">{sub}</span>}
      </span>
    </button>
  )
}

function OfferRow({ s, onStatus }) {
  const { t, lang } = useT()
  const now = useNow()
  const start = new Date(s.start)
  const end = new Date(s.end)
  const tone =
    s.status === 'AGREED' ? 'bg-ok/15 text-ok' : s.status === 'ASKED' ? 'bg-amber/15 text-amber-text' : 'bg-ink-raised text-sand'
  return (
    <li className="surface p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="flex flex-col">
          <span className="text-label text-cream">
            {POSTS[s.myPost][lang]} ↔ {POSTS[s.theirPost][lang]}
          </span>
          <span className="text-body text-sand">
            {s.colleague[lang]}, {relativeDay(start, now, lang)} {clockTime(start, lang)} – {clockTime(end, lang)}
          </span>
        </span>
        <span className={`shrink-0 rounded-full px-3 py-0.5 text-body font-medium ${tone}`}>{t(`swap.${s.status}`)}</span>
      </div>
      {s.status === 'AGREED' && <p className="mt-2 text-body text-sand">{t('swap.toSupervisor')}</p>}
      {s.status === 'ASKED' && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onStatus(s.id, 'AGREED')}
            className="min-h-tap rounded-3xl border border-zone-peers/50 px-2 text-body text-zone-peers"
          >
            {t('swap.demoAgree', { name: s.colleague[lang] })}
          </button>
          <button
            type="button"
            onClick={() => onStatus(s.id, 'CANCELLED')}
            className="flex min-h-tap items-center justify-center gap-1 rounded-3xl border border-ink-line px-2 text-body text-sand"
          >
            <X size={18} aria-hidden="true" />
            {t('swap.cancel')}
          </button>
        </div>
      )}
    </li>
  )
}
