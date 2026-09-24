import { Mic } from 'lucide-react'
import { useLongPress } from '../lib/useLongPress.js'

/**
 * The voice control. 160px, lit from within.
 *
 * idle      — breathes on a 4s cycle (scale 1 → 1.04), halo swells with it.
 * recording — the ring becomes a 7-bar level meter fed by `levels` (0–1),
 *             which the record screen drives from a real AnalyserNode.
 *
 * The label is INSIDE the button: tapping the word works (audit B5).
 */
export default function VoiceButton({
  label,
  sub,
  onClick,
  size = 160,
  recording = false,
  levels = [],
}) {
  const press = useLongPress(label)
  const bars = Array.from({ length: 7 }, (_, i) => levels[i] ?? 0)

  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      aria-label={sub ? `${label}. ${sub}` : label}
      aria-pressed={recording}
      className="group flex flex-col items-center gap-4 rounded-5xl px-4 pb-2 pt-4"
    >
      <span className="relative block" style={{ width: size, height: size }}>
        {!recording && (
          <span
            aria-hidden="true"
            className="anim-halo absolute -inset-5 rounded-full bg-amber/25 blur-2xl"
          />
        )}
        <span
          className={`relative flex h-full w-full items-center justify-center rounded-full shadow-glow-lg
            transition-colors duration-300 ease-calm
            ${recording ? 'bg-amber-glow' : 'anim-breathe bg-amber group-hover:bg-amber-glow'}`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 28%, rgba(255,236,200,0.55), rgba(255,196,107,0) 55%)',
          }}
        >
          {recording ? (
            <span className="flex h-16 items-center gap-1.5" aria-hidden="true">
              {bars.map((v, i) => (
                <span
                  key={i}
                  className="w-2 rounded-full bg-ink transition-[height] duration-100 ease-linear"
                  style={{ height: `${14 + v * 50}px` }}
                />
              ))}
            </span>
          ) : (
            <Mic size={Math.round(size * 0.34)} strokeWidth={1.6} className="text-ink" aria-hidden="true" />
          )}
        </span>
      </span>
      <span className="flex flex-col items-center">
        <span className="text-label-lg font-semibold text-cream">{label}</span>
        {sub && <span className="text-body text-sand">{sub}</span>}
      </span>
    </button>
  )
}
