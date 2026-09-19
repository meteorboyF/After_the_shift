import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useRelief } from '../../store/relief.js'
import {
  WITHHELD_FROM_SUPERVISOR,
  buildReliefPayload,
  supervisorViewOf,
} from '../../lib/reliefPayload.js'
import { formatDateTime } from '../../lib/time.js'

const TYPE_LABEL_KEY = {
  REST_HALF_HOUR: 'relief.rest',
  POST_CHANGE: 'relief.swap',
  SHADE_POST: 'relief.shade',
}

/**
 * Screen 3C — the privacy wall, drawn.
 *
 * The card below is not a mock-up of what a supervisor sees. It is rendered by
 * iterating the actual object supervisorViewOf() produces from the actual
 * payload that is about to be POSTed. If someone widened that projection, the
 * extra field would appear on this screen immediately rather than leaking
 * quietly — the guard would see it before the supervisor did.
 *
 * Beneath it, the three things withheld are struck through. P6 was already
 * modifying his behaviour out of fear of being read; the answer to that is to
 * show him the boundary, not to assure him it exists.
 */
export default function PreviewScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const draft = useRelief((s) => s.draft)
  const send = useRelief((s) => s.send)
  const clearDraft = useRelief((s) => s.clearDraft)

  useEffect(() => {
    if (!draft) navigate('/relief', { replace: true })
  }, [draft, navigate])

  // Built once so the timestamp shown is the timestamp sent.
  const payload = useMemo(() => (draft ? buildReliefPayload(draft) : null), [draft])

  if (!draft || !payload) return null

  const view = supervisorViewOf(payload)

  const labelFor = (field) =>
    field === 'type' ? t(TYPE_LABEL_KEY[view.type]) : formatDateTime(view.createdAt, lang)

  const confirm = async () => {
    await send(payload)
    navigate('/relief/status', { replace: true })
  }

  return (
    <ScreenShell guard="day_post" guardOpacity={0.14}>
      <h1 className="mt-4 measure-wide text-label-lg font-semibold leading-snug text-cream">
        {t('relief.previewHeading')}
      </h1>

      {/* Exactly the fields the supervisor projection carries, nothing added. */}
      <div className="mt-7 rounded-4xl border-2 border-amber/45 bg-ink-soft/70 p-6">
        {['type', 'createdAt']
          .filter((field) => view[field] != null)
          .map((field) => (
            <p
              key={field}
              className={
                field === 'type'
                  ? 'text-label-lg font-semibold text-cream'
                  : 'mt-2 text-base text-muted'
              }
            >
              {labelFor(field)}
            </p>
          ))}
      </div>

      <div className="mt-8 flex-1">
        <p className="text-base text-muted">{t('relief.willNotSee')}</p>
        <ul className="mt-4 flex flex-col gap-3">
          {WITHHELD_FROM_SUPERVISOR.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warn/12 text-warn">
                <Icon name="cross" size={20} strokeWidth={2.4} />
              </span>
              <span className="text-label text-muted line-through decoration-warn/70 decoration-2">
                {t(`relief.${item}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <BigButton onClick={confirm}>{t('relief.send')}</BigButton>
        <BigButton
          variant="outline"
          onClick={() => {
            clearDraft()
            navigate('/', { replace: true })
          }}
        >
          {t('relief.cancel')}
        </BigButton>
      </div>
    </ScreenShell>
  )
}
