import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Coffee, ListMusic, Lock } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Button from '../../components/Button.jsx'
import Heading from '../../components/Heading.jsx'
import WeekStrip from './WeekStrip.jsx'
import { useT } from '../../i18n/index.js'
import { useCheckins, weekSummary } from '../../store/checkins.js'
import { useNow } from '../../lib/clock.js'

/**
 * 1D — the visible result (P7: "I don't get any benefit from it"). A plain
 * record of the week, split by the shift each entry followed.
 */
export default function SavedScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  const now = useNow()
  const load = useCheckins((s) => s.load)
  const entries = useCheckins((s) => s.entries)
  useEffect(() => {
    load()
  }, [load])
  const week = weekSummary(entries, now)

  return (
    <Screen zone="mine" scene="shift-end" sceneOpacity={0.26} topLeft={<span />}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className="anim-rise flex h-20 w-20 items-center justify-center rounded-full bg-ok/15 text-ok">
          <Check size={44} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <Heading size="hero">{t('checkin.savedHeading')}</Heading>

        <div className="surface w-full p-5 text-left">
          <WeekStrip days={week.days} />
          <div className="mt-5 border-t border-ink-line/70 pt-4">
            <p className="text-label text-cream">{t('checkin.total', { n: week.total })}</p>
            <p className="text-body text-sand">{t('checkin.split', { night: week.afterNight, day: week.afterDay })}</p>
          </div>
        </div>

        <p className="flex items-center gap-2 text-body text-sand">
          <Lock size={18} strokeWidth={2} className="text-zone-mine" aria-hidden="true" />
          {t('checkin.nobody')}
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <Button variant="primary" icon={Check} label={t('checkin.ok')} onClick={() => navigate('/')} />
        <Button variant="secondary" icon={Coffee} label={t('checkin.askRest')} onClick={() => navigate('/relief')} />
        <Button variant="quiet" icon={ListMusic} label={t('checkin.past')} onClick={() => navigate('/checkin/entries')} />
      </div>
    </Screen>
  )
}
