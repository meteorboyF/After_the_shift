import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import BigButton from '../../components/BigButton.jsx'
import WeekStrip from '../../components/WeekStrip.jsx'
import Icon from '../../components/Icon.jsx'
import { useT } from '../../lib/useT.js'
import { useCheckins } from '../../store/checkins.js'
import { formatHour } from '../../lib/time.js'
import { summarise } from '../../lib/summary.js'
import { EASE_CALM } from '../../lib/motion.js'

/**
 * Screen 1D.
 *
 * P7 rejected expression outright — "I don't get any benefit from it." So this
 * screen never just says "saved". It shows the week, and one line the app
 * derived that the guard did not tell it: the hour they most often speak at.
 */
export default function SavedScreen() {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const load = useCheckins((s) => s.load)
  const entries = useCheckins((s) => s.entries)
  const reduced = useReducedMotion()

  useEffect(() => {
    load()
  }, [load])

  const { week, heaviestHour } = summarise(entries)

  return (
    <ScreenShell guard="resting" guardOpacity={0.26}>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.36, ease: EASE_CALM }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-ok/15 text-ok"
        >
          <Icon name="tick" size={44} strokeWidth={2.2} />
        </motion.div>

        <h1 className="text-label-lg font-semibold text-cream">{t('saved.heading')}</h1>

        <WeekStrip week={week} label={t('saved.weekLabel')} />

        {/* Only shown once there is something to derive it from. */}
        {heaviestHour != null && (
          <p className="measure-wide text-base leading-relaxed text-muted">
            {t('saved.heaviest', { time: formatHour(heaviestHour, lang) })}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <BigButton variant="outline" onClick={() => navigate('/relief')}>
          {t('saved.requestRelief')}
        </BigButton>
        <BigButton variant="quiet" onClick={() => navigate('/')}>
          {t('saved.home')}
        </BigButton>
      </div>
    </ScreenShell>
  )
}
