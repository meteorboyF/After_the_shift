import { homeKey, pickGuardImage } from './lib/guardImages.js'

/**
 * Phase 0 placeholder. This exists only to prove the scaffold boots with the
 * Bangla font, the amber-on-ink palette and the guard photo pipeline wired up.
 * Phase 1 replaces it with the real router, shell and design system.
 */
export default function App() {
  const photo = pickGuardImage(homeKey(), 0)

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-screenish flex-col justify-center overflow-hidden px-6">
      {photo && (
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.28] [filter:grayscale(1)_sepia(1)_saturate(2.2)_hue-rotate(-12deg)]"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,161,58,0.16),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />

      <div className="relative">
        <p className="text-sm uppercase tracking-[0.22em] text-amber">After the Shift</p>
        <h1 className="measure mt-3 text-display font-semibold text-cream">শিফটের পরে</h1>
        <p className="measure-wide mt-4 text-base text-muted">
          স্ক্যাফোল্ড প্রস্তুত। পরের ধাপে আসল স্ক্রিনগুলো।
        </p>
        <div className="mt-8 h-1 w-24 rounded-full bg-amber shadow-glow" />
      </div>
    </main>
  )
}
