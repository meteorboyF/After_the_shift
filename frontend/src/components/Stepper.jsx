import { Minus, Plus } from 'lucide-react'
import { useLongPress } from '../lib/useLongPress.js'

/** Tap-only number entry: two 64px buttons around a value. No keyboard, ever. */
export default function Stepper({ value, onMinus, onPlus, minusLabel, plusLabel, disabledMinus = false }) {
  return (
    <div className="flex items-center gap-2">
      <StepButton icon={Minus} label={minusLabel} onClick={onMinus} disabled={disabledMinus} />
      <span className="min-w-[5.5rem] text-center text-label font-semibold tabular-nums text-cream">{value}</span>
      <StepButton icon={Plus} label={plusLabel} onClick={onPlus} />
    </div>
  )
}

function StepButton({ icon: Icon, label, onClick, disabled }) {
  const press = useLongPress(label)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...press}
      aria-label={label}
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-amber/40 text-amber-glow transition-colors duration-300 hover:border-amber disabled:border-ink-line disabled:text-muted"
    >
      <Icon size={26} strokeWidth={2} aria-hidden="true" />
    </button>
  )
}
