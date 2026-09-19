import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useSupervisor } from '../../store/supervisor.js'
import { formatDateTime } from '../../lib/time.js'

const TYPE_LABEL_KEY = {
  REST_HALF_HOUR: 'relief.rest',
  POST_CHANGE: 'relief.swap',
  SHADE_POST: 'relief.shade',
}

/**
 * Demo route. Exists to prove the wall during the presentation, not to be a
 * real supervisor tool.
 *
 * It renders whatever /api/supervisor/relief returns — which is four fields per
 * row, because ReliefCard has no others. There is no filtering or hiding
 * happening in this component: the data a guard wants kept private never
 * arrives here in the first place.
 *
 * Note this screen is not behind the guard's PIN and shares no store with the
 * check-in or grounding features. It reads one endpoint and nothing else.
 */
export default function SupervisorScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const rows = useSupervisor((s) => s.rows)
  const loaded = useSupervisor((s) => s.loaded)
  const refresh = useSupervisor((s) => s.refresh)
  const accept = useSupervisor((s) => s.accept)

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <ScreenShell
      guard="greeting"
      guardOpacity={0.12}
      onBack={() => navigate('/')}
      backLabel={t('supervisor.back')}
    >
      <h1 className="mt-2 text-label-lg font-semibold text-cream">{t('supervisor.heading')}</h1>
      <p className="mt-1 text-base text-muted">{t('supervisor.subtitle')}</p>

      {/* Stated on the supervisor's own screen too, not only the guard's. */}
      <div className="mt-5 flex items-start gap-3 rounded-3xl border border-warn/30 bg-warn/5 px-4 py-3">
        <span className="mt-0.5 text-warn">
          <Icon name="cross" size={20} strokeWidth={2.2} />
        </span>
        <p className="text-base leading-relaxed text-muted">{t('supervisor.noAccess')}</p>
      </div>

      {loaded && rows.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-base text-muted">{t('supervisor.empty')}</p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-1 flex-col gap-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-3xl bg-ink-soft/70 p-4">
              <p className="text-label leading-snug text-cream">
                {t(TYPE_LABEL_KEY[row.type] ?? 'relief.rest')}
              </p>
              <p className="mt-1 text-sm text-muted">{formatDateTime(row.createdAt, lang)}</p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`text-base ${
                    row.status === 'ACCEPTED' ? 'text-ok' : 'text-muted'
                  }`}
                >
                  {row.status === 'ACCEPTED' ? t('relief.accepted') : t('relief.pending')}
                </span>

                {row.status !== 'ACCEPTED' && (
                  <button
                    type="button"
                    onClick={() => accept(row.id)}
                    className="tap rounded-2xl border border-ok/40 px-5 text-base text-ok
                      transition-colors duration-200 ease-calm hover:bg-ok/10"
                  >
                    {t('supervisor.accept')}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <BigButton variant="quiet" onClick={() => navigate('/')}>
        {t('supervisor.back')}
      </BigButton>
    </ScreenShell>
  )
}
