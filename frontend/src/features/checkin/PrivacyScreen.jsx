import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useCheckins } from '../../store/checkins.js'

/**
 * Screen 1C — shown *before* anything is stored.
 *
 * P6 feared a supervisor reading his words: "if they see it, then they take our
 * statement." So the answer is given on the screen where it matters, in the
 * guard's own language, rather than buried in a settings page.
 *
 * Keep and Delete are the same size. Deleting is a normal outcome here, not a
 * penalty, and must not be styled as one.
 */
export default function PrivacyScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const pending = useCheckins((s) => s.pending)
  const keepPending = useCheckins((s) => s.keepPending)
  const discardPending = useCheckins((s) => s.discardPending)

  // Landing here without a recording (a refresh, a stray link) goes home rather
  // than showing a privacy promise about nothing.
  useEffect(() => {
    if (!pending) navigate('/', { replace: true })
  }, [pending, navigate])

  if (!pending) return null

  const keep = async () => {
    await keepPending()
    navigate('/checkin/saved', { replace: true })
  }

  const discard = () => {
    discardPending()
    navigate('/', { replace: true })
  }

  return (
    <ScreenShell guard="shift_end" guardOpacity={0.2}>
      <div className="flex flex-1 flex-col justify-center gap-9">
        <h1 className="measure-wide text-label-lg font-semibold leading-snug text-cream">
          {t('privacy.heading')}
        </h1>

        <ul className="flex flex-col gap-5">
          <li className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ok/15 text-ok">
              <Icon name="tick" size={26} strokeWidth={2.2} />
            </span>
            <span className="text-label text-cream">{t('privacy.onlyYou')}</span>
          </li>

          {/* Drawn larger — this is the line the research says carries the weight. */}
          <li className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-warn/15 text-warn">
              <Icon name="cross" size={34} strokeWidth={2.4} />
            </span>
            <span className="text-label-lg font-semibold leading-snug text-cream">
              {t('privacy.notSupervisor')}
            </span>
          </li>
        </ul>

        <p className="text-base text-muted">{t('privacy.staysOnPhone')}</p>
      </div>

      <div className="flex flex-col gap-3">
        <BigButton onClick={keep}>{t('privacy.keep')}</BigButton>
        <BigButton variant="outline" onClick={discard}>
          {t('privacy.discard')}
        </BigButton>
      </div>
    </ScreenShell>
  )
}
