import { Brain, Droplet, Frown, Megaphone, Phone, Shirt, Tent, Volume2, Wind, Zap } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import Button from '../../components/Button.jsx'
import { useT } from '../../i18n/index.js'
import { readAloud } from '../../lib/speech.js'

/** Heat-illness signs and what to do, with pictograms and read-aloud. */
const SIGNS = [
  [Brain, 'headache'],
  [Wind, 'dizzy'],
  [Frown, 'nausea'],
  [Zap, 'weak'],
]
const DO = [
  [Tent, 'goShade'],
  [Droplet, 'drink'],
  [Shirt, 'loosen'],
  [Megaphone, 'tell'],
]

export default function HeatSignsScreen() {
  const { t, lang } = useT()
  const readAll = () =>
    readAloud(
      `${t('heat.signs')}: ${SIGNS.map(([, k]) => t(`heat.${k}`)).join(', ')}। ${t('heat.doHeading')}: ${DO.map(([, k]) => t(`heat.${k}`)).join(', ')}।`,
      lang,
    )
  return (
    <Screen zone="mine" back="/">
      <div className="mt-2 flex items-start justify-between gap-3">
        <Heading>{t('heat.signsHeading')}</Heading>
        <button
          type="button"
          onClick={readAll}
          aria-label={t('heat.readAll')}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-amber/40 text-amber-glow"
        >
          <Volume2 size={28} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <Group title={t('heat.signs')} items={SIGNS} tone="bg-warn/15 text-warn" />
      <Group title={t('heat.doHeading')} items={DO} tone="bg-ok/15 text-ok" />

      <div className="mt-6">
        <Button variant="primary" icon={Phone} label={t('heat.call')} onClick={() => readAloud(t('heat.callDemo'), lang)} />
      </div>
    </Screen>
  )
}

function Group({ title, items, tone }) {
  const { t } = useT()
  return (
    <section className="mt-5">
      <h2 className="px-1 text-label text-sand">{title}</h2>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {items.map(([Icon, k]) => (
          <li key={k} className="surface flex flex-col items-start gap-2 p-4">
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${tone}`}>
              <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-label leading-snug text-cream">{t(`heat.${k}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
