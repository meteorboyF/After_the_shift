import { useLocation, useNavigate } from 'react-router-dom'
import { Volume2 } from 'lucide-react'
import Screen from '../../components/Screen.jsx'
import Heading from '../../components/Heading.jsx'
import { useT } from '../../i18n/index.js'
import { readAloud } from '../../lib/speech.js'
import { useLongPress } from '../../lib/useLongPress.js'
import { EXERCISES, ORDER } from './exercises.js'

/**
 * 2B — two steps from anywhere to an exercise: one tap to here, one to start.
 * Never uses the words stress, mental health, therapy or counselling.
 */
export default function ChooseScreen() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { t, lang } = useT()
  const from = state?.from ?? '/'

  const readAll = () =>
    readAloud(
      ORDER.map((k) => `${t(`grounding.${k}`)}, ${t('grounding.minutes', { n: EXERCISES[k].minutes })}`).join('। '),
      lang,
    )

  return (
    <Screen zone="mine" back={from} lamp={0.85}>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <Heading>{t('grounding.heading')}</Heading>
          <p className="mt-1 text-body text-sand">{t('grounding.sub')}</p>
        </div>
        <button
          type="button"
          onClick={readAll}
          aria-label={t('grounding.readOptions')}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-amber/40 text-amber-glow transition-colors duration-300 hover:border-amber"
        >
          <Volume2 size={28} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {ORDER.map((k) => (
          <li key={k}>
            <Option
              icon={EXERCISES[k].icon}
              label={t(`grounding.${k}`)}
              minutes={t('grounding.minutes', { n: EXERCISES[k].minutes })}
              onClick={() => navigate(`/grounding/${k}`, { state: { from } })}
            />
          </li>
        ))}
      </ul>
    </Screen>
  )
}

function Option({ icon: Icon, label, minutes, onClick }) {
  const press = useLongPress(`${label}, ${minutes}`)
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      className="surface flex min-h-[112px] w-full items-center gap-5 px-5 text-left transition-[transform,border-color] duration-300 ease-calm hover:border-amber/40 active:scale-[0.985]"
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber-glow">
        <Icon size={32} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-label-lg font-semibold leading-snug text-cream">{label}</span>
        <span className="text-body text-sand">{minutes}</span>
      </span>
    </button>
  )
}
