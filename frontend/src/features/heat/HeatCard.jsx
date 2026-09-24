import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Droplet, GlassWater, Sofa, Sun, Umbrella } from 'lucide-react'
import { useT } from '../../i18n/index.js'
import { useMine } from '../../store/mine.js'
import { typicalRange, monthName } from '../../lib/heat.js'
import { num } from '../../lib/format.js'

/**
 * 5.5 Heat card — passive. It appears on Home only on a day shift, only when
 * the guard opens the app. No reminder, no target, no warning when the tally is
 * low (rule 3). Research: OSHA "Water. Rest. Shade."; P2, P5, P7, P8 on the sun.
 */
export default function HeatCard({ shiftId, now, anchor }) {
  const navigate = useNavigate()
  const { t, lang } = useT()
  const mine = useMine()
  useEffect(() => {
    mine.load(anchor)
  }, [anchor]) // eslint-disable-line react-hooks/exhaustive-deps

  const { min, max } = typicalRange(now)
  const glasses = mine.water[shiftId] ?? 0

  return (
    <section className="surface mt-3 p-4" aria-label={t('heat.card')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warn/15 text-warn">
            <Sun size={26} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-label font-semibold leading-snug text-cream">
              {t('heat.card')} {t('heat.range', { min: num(min, lang), max: num(max, lang) })}
            </span>
            <span className="text-body text-sand">{t('heat.typical', { month: monthName(now, lang) })}</span>
          </span>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          [Droplet, 'water'],
          [Sofa, 'rest'],
          [Umbrella, 'shade'],
        ].map(([Icon, k]) => (
          <li key={k} className="flex items-center justify-center gap-1.5 rounded-3xl bg-ink-raised/70 py-2.5 text-body text-cream">
            <Icon size={20} strokeWidth={1.75} className="text-amber-glow" aria-hidden="true" />
            {t(`heat.${k}`)}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-body text-sand">
          {t('heat.tally')}: <span className="font-semibold text-cream">{t('heat.glasses', { n: glasses })}</span>
        </span>
        <div className="flex gap-2">
          {glasses > 0 && (
            <button
              type="button"
              onClick={() => mine.addWater(shiftId, -1)}
              aria-label={t('heat.removeGlass')}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink-line text-label text-sand"
            >
              −
            </button>
          )}
          <button
            type="button"
            onClick={() => mine.addWater(shiftId, 1)}
            aria-label={t('heat.addGlass')}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber/50 text-amber-glow"
          >
            <GlassWater size={26} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className={`flex flex-wrap gap-1.5 ${glasses ? "mt-2" : ""}`} aria-hidden="true">
        {Array.from({ length: glasses }, (_, i) => (
          <GlassWater key={i} size={22} strokeWidth={1.75} className="text-amber-glow" />
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate('/heat')}
        className="mt-2 flex min-h-tap w-full items-center justify-between rounded-3xl border-t border-ink-line/70 px-1 pt-2 text-label text-cream"
      >
        {t('heat.signsLink')}
        <ChevronRight size={22} strokeWidth={1.75} className="text-sand" aria-hidden="true" />
      </button>
    </section>
  )
}
