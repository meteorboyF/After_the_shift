import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { summariseRelief, useRelief } from '../../store/relief.js'
import { formatDay, relativeAge } from '../../lib/time.js'
import { stagger } from '../../lib/motion.js'

const TYPE_LABEL_KEY = {
  REST_HALF_HOUR: 'relief.rest',
  POST_CHANGE: 'relief.swap',
  SHADE_POST: 'relief.shade',
}

const STATUS_STYLE = {
  PENDING: { key: 'relief.pending', icon: 'clock', tone: 'text-muted', ring: 'border-muted/25' },
  ACCEPTED: { key: 'relief.accepted', icon: 'tick', tone: 'text-ok', ring: 'border-ok/40' },
  // Warm ochre, never red, and the copy never asks the guard to justify it.
  REJECTED: { key: 'relief.rejected', icon: 'cross', tone: 'text-warn', ring: 'border-warn/40' },
}

/**
 * Screen 3D.
 *
 * The tally is the point of this screen. P7 rejected expression because he got
 * nothing back from it — "I don't get any benefit." Two lines showing that five
 * requests were made and four were granted is the app answering him, so it is
 * shown even when the list is short.
 *
 * Withdrawing is always available. Asking for rest is never irreversible.
 */
export default function StatusScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const load = useRelief((s) => s.load)
  const refreshStatuses = useRelief((s) => s.refreshStatuses)
  const requests = useRelief((s) => s.requests)
  const withdraw = useRelief((s) => s.withdraw)

  useEffect(() => {
    load().then(refreshStatuses)
  }, [load, refreshStatuses])

  const { monthCount, acceptedCount } = summariseRelief(requests)

  return (
    <ScreenShell
      guard={acceptedCount > 0 ? 'relief_granted' : 'day_post'}
      guardOpacity={0.2}
      onBack={() => navigate('/')}
      backLabel={t('common.back')}
      footer={
        <BigButton variant="outline" onClick={() => navigate('/relief')}>
          {t('relief.newRequest')}
        </BigButton>
      }
    >
      <h1 className="mt-2 text-label-lg font-semibold text-cream">{t('relief.statusHeading')}</h1>

      {/* The two-line tally — the proof the app does something. */}
      <div className="mt-5 rounded-3xl bg-ink-soft/70 px-5 py-4">
        <p className="text-label text-cream">{t('relief.tallyRequests', { n: monthCount })}</p>
        <p className="mt-1 text-base text-ok">{t('relief.tallyAccepted', { n: acceptedCount })}</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-base text-muted">{t('relief.empty')}</p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-1 flex-col gap-3">
          {requests.map((request, index) => {
            const style = STATUS_STYLE[request.status] ?? STATUS_STYLE.PENDING
            const age = relativeAge(request.createdAt, t) ?? formatDay(request.createdAt, lang)

            return (
              <motion.li
                key={request.localId}
                {...stagger(false, index)}
                className={`rounded-3xl border-2 ${style.ring} bg-ink-soft/60 p-4`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-raised ${style.tone}`}>
                    <Icon name={style.icon} size={22} strokeWidth={2.1} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-label leading-snug text-cream">
                      {t(TYPE_LABEL_KEY[request.type])}
                    </p>
                    <p className={`text-sm ${style.tone}`}>
                      {t(style.key)} · {age}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => withdraw(request.localId)}
                  className="tap mt-3 flex w-full items-center justify-center rounded-2xl
                    border border-muted/20 px-4 text-base text-muted
                    transition-colors duration-200 ease-calm hover:border-warn/40 hover:text-warn"
                >
                  {t('relief.withdraw')}
                </button>
              </motion.li>
            )
          })}
        </ul>
      )}
    </ScreenShell>
  )
}
