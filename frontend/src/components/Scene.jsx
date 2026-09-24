/**
 * Atmospheric photograph, bottom-anchored behind the content.
 *
 * The scene reflects the app's CONTEXT — time of day, end of shift — never the
 * guard's mood. It is never selectable and never labelled. Images are pre-baked
 * to an amber duotone with a soft blur so no face is identifiable (see
 * public/scenes and docs/audit §5).
 */
export const SCENES = {
  'night-gate': 'scenes/night-gate.webp',
  'day-gate': 'scenes/day-gate.webp',
  'shift-end': 'scenes/shift-end.webp',
  resting: 'scenes/resting.webp',
}

export default function Scene({ name, opacity = 0.3, height = '62%' }) {
  const src = SCENES[name]
  if (!src) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] mx-auto max-w-phone"
      style={{ height }}
    >
      <img
        src={`${import.meta.env.BASE_URL}${src}`}
        alt=""
        className="h-full w-full object-cover object-bottom"
        style={{
          '--scene-opacity': opacity,
          opacity,
          animation: 'scene-in 1.6s ease-out both',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 55%, #000 80%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, #000 55%, #000 80%, transparent 100%)',
        }}
      />
      {/* keep the lamp warm on top of the photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
    </div>
  )
}
