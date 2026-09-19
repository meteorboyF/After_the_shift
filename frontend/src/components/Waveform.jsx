import { BAND_COUNT } from '../lib/recorder.js'

/**
 * Seven bars driven by the live microphone signal.
 *
 * `levels` comes straight from the AnalyserNode via bandsFromFrequencyData —
 * there is no synthetic motion here. When the room is silent the bars sit at
 * their resting height, which is the honest reading, not a failure state.
 */
export default function Waveform({ levels = [], idle = false }) {
  const bars = Array.from({ length: BAND_COUNT }, (_, i) => levels[i] ?? 0)

  return (
    <div
      className="flex h-28 items-end justify-center gap-2.5"
      role="presentation"
      aria-hidden="true"
    >
      {bars.map((level, index) => {
        // A floor of 8% keeps the bars visible in silence instead of vanishing.
        const height = idle ? 8 : 8 + Math.min(1, level * 1.35) * 92
        return (
          <span
            key={index}
            className="w-3.5 rounded-full bg-amber shadow-glow"
            style={{
              height: `${height}%`,
              // Short enough to track speech, long enough not to strobe.
              transition: 'height 90ms linear',
              opacity: 0.55 + Math.min(1, level * 1.35) * 0.45,
            }}
          />
        )
      })}
    </div>
  )
}
