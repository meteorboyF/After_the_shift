import { useT } from '../../i18n/index.js'

/**
 * Seven days, oldest → today. A filled day had an entry. Unlabelled days on
 * purpose (a named gap becomes "you missed Tuesday"), but today is marked and
 * the ends say which way time runs (audit C5). No streak, no count of gaps.
 */
export default function WeekStrip({ days }) {
  const { t } = useT()
  return (
    <figure className="w-full" aria-label={t('checkin.week')}>
      <div className="flex items-end justify-between gap-2">
        {days.map((d, i) => (
          <span
            key={i}
            className={`anim-rise h-11 flex-1 rounded-2xl ${
              d.filled ? 'bg-amber shadow-glow' : 'border-2 border-ink-line bg-ink-soft'
            } ${d.today ? 'outline outline-2 outline-offset-4 outline-amber-glow/70' : ''}`}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      <figcaption className="mt-3 flex justify-between text-body text-sand">
        <span>{t('checkin.weekAgo')}</span>
        <span className="font-medium text-cream">{t('checkin.today')}</span>
      </figcaption>
    </figure>
  )
}
