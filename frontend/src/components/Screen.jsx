import LangToggle from './LangToggle.jsx'
import ZoneBadge from './ZoneBadge.jsx'
import Scene from './Scene.jsx'
import BackButton from './BackButton.jsx'

/**
 * Every screen sits in this.
 *
 * - The lamp (radial light from above) and film grain behind everything.
 * - An optional context scene, bottom-anchored.
 * - A top bar: language on the left, the zone badge on the right — same place
 *   on every screen.
 * - `dock`: a control pinned to the bottom, always one thumb away.
 */
export default function Screen({
  zone,
  scene,
  sceneOpacity,
  lamp = 1,
  topLeft,
  back,
  dock,
  children,
  className = '',
}) {
  return (
    <>
      <div className="atmosphere" style={{ '--lamp-strength': lamp }} aria-hidden="true" />
      {scene && <Scene name={scene} opacity={sceneOpacity} />}
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-phone flex-col px-4">
        <header className="flex min-h-tap items-center justify-between pt-[max(env(safe-area-inset-top),8px)]">
          {topLeft ?? (back !== undefined ? <BackButton to={back} /> : <LangToggle />)}
          {zone && <ZoneBadge zone={zone} />}
        </header>

        <main className={`anim-rise flex flex-1 flex-col ${dock ? 'pb-32' : 'pb-8'} ${className}`}>
          {children}
        </main>
      </div>

      {dock && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto max-w-phone px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-transparent" />
          <div className="pointer-events-auto relative">{dock}</div>
        </div>
      )}
    </>
  )
}
