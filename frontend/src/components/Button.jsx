import { useLongPress } from '../lib/useLongPress.js'

const VARIANTS = {
  // The one action a screen exists for. Lit by the lamp.
  primary:
    'bg-amber text-ink shadow-glow hover:bg-amber-glow active:scale-[0.985] font-semibold',
  // Present, available, never competing.
  secondary:
    'border-2 border-amber/45 bg-ink/60 text-cream backdrop-blur-sm hover:border-amber/80 active:scale-[0.985] font-medium',
  // Leaves, cancels, goes back.
  quiet: 'text-sand hover:text-cream font-medium',
}

/**
 * Full-width, 72px tall, icon + label. Long-press reads the label aloud.
 * `label` is required — it is what gets read.
 */
export default function Button({
  variant = 'primary',
  icon: Icon,
  label,
  sub,
  onClick,
  className = '',
  ...rest
}) {
  const press = useLongPress(sub ? `${label}. ${sub}` : label)
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      {...rest}
      className={`flex min-h-[72px] w-full items-center justify-center gap-3 rounded-4xl px-6 text-label
        transition-[transform,background-color,border-color,color] duration-300 ease-calm ${VARIANTS[variant]} ${className}`}
    >
      {Icon && <Icon size={28} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />}
      <span className="flex flex-col items-start leading-snug">
        <span className="pt-0.5">{label}</span>
        {sub && <span className="text-body font-normal opacity-80">{sub}</span>}
      </span>
    </button>
  )
}
