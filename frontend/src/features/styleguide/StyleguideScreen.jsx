import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  Coffee,
  Home,
  Hourglass,
  Link2,
  RotateCcw,
  Send,
  Wind,
  X,
} from 'lucide-react'
import Button from '../../components/Button.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import ZoneBadge from '../../components/ZoneBadge.jsx'
import Tile from '../../components/Tile.jsx'
import Quote from '../../components/Quote.jsx'
import BreathingCircle, { phaseAt, useBreath } from '../../components/BreathingCircle.jsx'
import ShiftArc from '../home/ShiftArc.jsx'
import { SCENES } from '../../components/Scene.jsx'
import { useClock } from '../../lib/clock.js'
import { useApp } from '../../store/app.js'
import { shiftState } from '../../lib/roster.js'

/**
 * /styleguide — the style tile for review (Phase 2).
 *
 * Presenter-facing, so annotations are in English. Every sample of the guard's
 * UI is in Bangla, at the size the guard will see it.
 */

const COLORS = [
  { name: 'ink', hex: '#12151F', role: 'Night. Every background.' },
  { name: 'ink.soft', hex: '#1A1F2E', role: 'Surfaces' },
  { name: 'ink.raised', hex: '#232939', role: 'Raised surfaces' },
  { name: 'amber', hex: '#E8A13A', role: 'The lamp. Primary fills only.' },
  { name: 'amber.glow', hex: '#FFC46B', role: 'Light, icons, highlights' },
  { name: 'cream', hex: '#F5EDE1', role: 'Primary text', text: true },
  { name: 'sand', hex: '#C4BBAD', role: 'Secondary text', text: true },
  { name: 'muted', hex: '#8A93A6', role: 'Decoration only. Never words.' },
  { name: 'zone.mine', hex: '#F2B45A', role: 'নিজের: only the guard', text: true },
  { name: 'zone.peers', hex: '#7CCABD', role: 'সহকর্মী: named colleagues', text: true },
  { name: 'zone.super', hex: '#B9C0CE', role: 'সুপারভাইজার: the office', text: true },
  { name: 'ok', hex: '#7FC497', role: 'Accepted', text: true },
  { name: 'warn', hex: '#E09A6B', role: 'Not this time. Never red.', text: true },
]

function luminance(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const l = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

function Section({ title, note, children }) {
  return (
    <section className="border-t border-ink-line/70 py-10">
      <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <h2 className="font-serif text-[26px] font-semibold text-cream">{title}</h2>
        {note && <p className="max-w-xl text-[16px] leading-relaxed text-sand">{note}</p>}
      </div>
      {children}
    </section>
  )
}

function Note({ children }) {
  return <p className="mt-2 text-[15px] leading-relaxed text-sand">{children}</p>
}

export default function StyleguideScreen() {
  const navigate = useNavigate()
  const setOffset = useClock((s) => s.setOffset)
  const anchor = useApp((s) => s.anchor)
  const resetClock = useClock((s) => s.reset)
  const breath = useBreath(true)
  const phase = phaseAt(breath)
  const [levels, setLevels] = useState([])
  const [rise, setRise] = useState(0)

  // Demo levels for the static sample only. The real record screen feeds the
  // meter from an AnalyserNode on the microphone.
  useEffect(() => {
    let t = 0
    const id = setInterval(() => {
      t += 1
      setLevels(Array.from({ length: 7 }, (_, i) => 0.25 + 0.6 * Math.abs(Math.sin(t * 0.35 + i * 0.9)) ** 2))
    }, 110)
    return () => clearInterval(id)
  }, [])

  // States are placed relative to the guard's real shift, so they work whichever
  // rota (day or night week) the demo seeded on first launch.
  const base = anchor ? shiftState(anchor, new Date()) : null
  const ref = base ? (base.current ?? base.previous ?? base.next) : null
  const HOUR = 3_600_000
  const states = ref
    ? [
        [ref.start.getTime() + 5 * HOUR, 'Mid-shift', 'Arc + quiet check-in'],
        [ref.end.getTime() - 0.6 * HOUR, 'Last hour', 'Check-in rises'],
        [ref.end.getTime() + 0.4 * HOUR, 'Just ended', 'Check-in stays up'],
        [ref.end.getTime() + 5 * HOUR, 'Off duty', 'Counts down to next shift'],
      ]
    : []
  const openHomeAt = (ms) => {
    setOffset(ms - Date.now())
    navigate('/')
  }
  const hhmm = (ms) => {
    const d = new Date(ms)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <>
      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-24 pt-10 md:px-10" lang="en">
        {/* Masthead */}
        <header className="pb-10">
          <p className="font-display text-title text-amber-glow" lang="bn">
            শিফটের পরে
          </p>
          <h1 className="mt-2 font-serif text-[40px] font-semibold leading-tight text-cream md:text-[56px]">
            A lamp left on for someone coming home late.
          </h1>
          <p className="mt-4 max-w-2xl text-[18px] leading-relaxed text-sand">
            Style tile for the rebuild of <em>After the Shift</em>, a shift companion for campus security guards
            in Dhaka. Warm, quiet, dignified. Everything on this page is the real component, running live.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex min-h-tap items-center gap-2 rounded-full bg-amber px-6 text-[18px] font-semibold text-ink shadow-glow"
            >
              <Home size={22} strokeWidth={1.75} aria-hidden="true" /> Open Home (1A)
            </button>
          </div>
        </header>

        {/* Principles */}
        <Section title="Five rules for every screen">
          <ol className="grid gap-4 md:grid-cols-5" lang="en">
            {[
              ['One light', 'A single warm radial source from above, fading into navy. Grain at 4.5%.'],
              ['One heading', 'Large, in Tiro Bangla. Everything else steps back.'],
              ['One primary', 'Only the primary action is lit amber. Everything else is outline or text.'],
              ['One zone badge', 'Top-right, every screen: who can see what is here.'],
              ['No face, no mood', 'Photos show the place and the hour, never how anyone feels.'],
            ].map(([h, b]) => (
              <li key={h} className="surface p-5">
                <p className="text-[19px] font-semibold text-cream">{h}</p>
                <p className="mt-1 text-[16px] leading-relaxed text-sand">{b}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Colour */}
        <Section
          title="Colour"
          note="Every text colour clears 7:1 against ink (the ratio is measured live below). Muted is kept for decoration only."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {COLORS.map((c) => {
              const ratio = contrast(c.hex, '#12151F')
              return (
                <div key={c.name} className="surface overflow-hidden p-0">
                  <div className="h-20" style={{ background: c.hex }} />
                  <div className="p-4">
                    <p className="text-[17px] font-semibold text-cream">{c.name}</p>
                    <p className="font-mono text-[14px] text-sand">{c.hex}</p>
                    <p className="mt-1 text-[15px] leading-snug text-sand">{c.role}</p>
                    {c.text && (
                      <p className={`mt-2 text-[14px] font-semibold ${ratio >= 7 ? 'text-ok' : 'text-warn'}`}>
                        {ratio.toFixed(1)}:1 on ink
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Type */}
        <Section
          title="Type"
          note="Tiro Bangla (a warm Bangla serif) for the one heading. Hind Siliguri for everything a guard reads or taps. Fraunces for English display. Bangla line-height 1.7. Nothing under 18px."
        >
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="surface space-y-5 p-6" lang="bn">
              <div>
                <p className="font-display text-hero text-cream">রাতের ডিউটি চলছে</p>
                <Note>Hero · Tiro Bangla 44 · reserved for one moment per flow (e.g. the saved result)</Note>
              </div>
              <div>
                <p className="font-display text-title text-cream">সুপারভাইজার এটাই দেখবেন</p>
                <Note>Title · Tiro Bangla 32 · the one heading per screen</Note>
              </div>
              <div>
                <p className="text-label-lg font-semibold text-cream">শেষ হতে ৩ ঘণ্টা ১০ মিনিট</p>
                <Note>Label large · Hind Siliguri 600 · 26</Note>
              </div>
              <div>
                <p className="text-label text-cream">আধা ঘণ্টা বিশ্রাম</p>
                <Note>Label · Hind Siliguri 500 · 22 · buttons, tiles, rows</Note>
              </div>
              <div>
                <p className="text-body text-sand">কারণ বলা লাগবে না</p>
                <Note>Body · Hind Siliguri 400 · 18 · the floor</Note>
              </div>
            </div>
            <div className="surface space-y-5 p-6">
              <div>
                <p className="font-serif text-[40px] font-semibold leading-tight text-cream">Night shift on</p>
                <Note>English title · Fraunces 600</Note>
              </div>
              <div>
                <p className="font-serif text-[24px] italic leading-snug text-cream">
                  I keep the pain in my mind.
                </p>
                <Note>Quotes · Fraunces italic</Note>
              </div>
              <div>
                <p className="text-label text-cream">Half an hour of rest</p>
                <Note>English UI · Hind Siliguri, same sizes as Bangla</Note>
              </div>
              <div>
                <p className="font-display text-[26px] text-cream" lang="bn">
                  ০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯
                </p>
                <Note>Numbers are always Bangla numerals in Bangla mode, including times.</Note>
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons + voice */}
        <Section
          title="Actions"
          note="Three button variants, 72px tall, icon + label. Long-press any control to hear its label and see it large (it only speaks where a Bangla voice exists)."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface space-y-3 p-6" lang="bn">
              <Button variant="primary" icon={Send} label="পাঠান" />
              <Note>Primary: lit by the lamp. One per screen.</Note>
              <Button variant="secondary" icon={Wind} label="এখন কষ্ট হচ্ছে" />
              <Note>Secondary: always available, never competing.</Note>
              <Button variant="quiet" icon={X} label="বাতিল" />
              <Note>Quiet: leave, cancel, go back.</Note>
            </div>
            <div className="surface grid grid-cols-2 place-items-center gap-2 p-6" lang="bn">
              <div className="flex flex-col items-center">
                <VoiceButton label="বলুন" sub="শুধু আপনি শুনবেন" />
                <Note>Idle: 4s breath, 1 → 1.04</Note>
              </div>
              <div className="flex flex-col items-center">
                <VoiceButton label="শুনছি" recording levels={levels} />
                <Note>Recording (demo levels here; live mic on the real screen)</Note>
              </div>
            </div>
          </div>
        </Section>

        {/* Zones */}
        <Section
          title="The three data zones"
          note="The organising idea of the app. Each zone is a separate on-device database. The badge sits top-right on every screen; tapping it explains the zone in one spoken sentence."
        >
          <div className="grid gap-3 md:grid-cols-3" lang="bn">
            {[
              ['mine', 'Only the guard, on this phone. Check-ins, grounding, hours, sleep, water.'],
              ['peers', 'Named colleagues only. Post swaps, handover notes.'],
              ['super', 'The supervisor. Relief requests, and the roster they publish.'],
            ].map(([z, d]) => (
              <div key={z} className="surface flex flex-col items-start gap-2 p-5">
                <ZoneBadge zone={z} />
                <p className="text-[16px] leading-relaxed text-sand" lang="en">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Card + quote */}
        <Section
          title="Cards and quotes"
          note="Cards are lifted by a 1px highlight on their top edge (light from above), not by a grey shadow. Each tile shows one live fact, so it is useful before it is opened. The small corner mark is the zone of the screen it opens."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="grid grid-cols-2 gap-3" lang="bn">
              <Tile icon={CalendarDays} label="রোস্টার" fact="কাল রাত ৭টা" zone="super" />
              <Tile icon={Hourglass} label="ঘণ্টার হিসাব" fact="এই সপ্তাহে ৬০ ঘণ্টা" zone="mine" />
              <Tile icon={Coffee} label="বিশ্রাম চাই" fact="১টি অপেক্ষায়" zone="super" />
              <Tile icon={ArrowLeftRight} label="পোস্ট বদল" fact="পাশে ৩ জন সহকর্মী" zone="peers" />
            </div>
            <div className="surface flex flex-col justify-center gap-8 p-8">
              <Quote who="P8">
                If someone else could be placed there and I could be moved to another post for half an hour, then I
                would get a little rest.
              </Quote>
              <Quote who="P6">If they see it, then they take our statement.</Quote>
            </div>
          </div>
        </Section>

        {/* Photo treatment */}
        <Section
          title="Scenes, not faces"
          note="Photos are pre-baked to an amber duotone with a soft blur, sit bottom-anchored at 30% opacity, and fade in over 1.6s. They follow the time of day and the app's context, never the guard's mood. Only faceless or distant shots are kept; stock, police and branded images are dropped."
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['night-gate', 'Night post'],
              ['day-gate', 'Day post'],
              ['shift-end', 'End of shift'],
              ['resting', 'Off duty'],
            ].map(([k, label]) => (
              <figure key={k} className="surface relative h-72 overflow-hidden p-0">
                <img
                  src={`${import.meta.env.BASE_URL}${SCENES[k]}`}
                  alt=""
                  className="absolute inset-x-0 bottom-0 h-3/4 w-full object-cover object-bottom opacity-30"
                  style={{
                    maskImage: 'linear-gradient(180deg, transparent, #000 55%, #000 80%, transparent)',
                    WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 55%, #000 80%, transparent)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(80% 45% at 50% -8%, rgba(255,196,107,0.24), rgba(18,21,31,0) 70%)',
                  }}
                />
                <figcaption className="absolute left-4 top-4 text-[16px] font-medium text-cream">{label}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* Motion */}
        <Section
          title="Motion"
          note="Calm and slow: 250–400ms, eased, no overshoot, no bounce. Under prefers-reduced-motion, scale and slide become opacity alone."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface flex flex-col items-center p-6" lang="bn">
              <BreathingCircle sec={breath} size={96} />
              <p className="mt-2 font-display text-title text-cream">
                {phase === 'in' ? 'নিন' : phase === 'hold' ? 'ধরে রাখুন' : 'ছাড়ুন'}
              </p>
              <Note>
                Breathing: 4s in · 2s hold · 6s out. Now {(breath % 12).toFixed(1)}s of 12.
              </Note>
            </div>
            <div className="surface flex flex-col items-center justify-between p-6" lang="bn">
              <div className="w-full">
                <ShiftArc progress={(breath / 24) % 1} kind="NIGHT" />
                <p className="mt-2 text-center" lang="bn">
                  <span className="text-label text-sand">শেষ হতে </span>
                  <span className="text-[26px] font-semibold text-cream">৩ ঘণ্টা</span>
                </p>
              </div>
              <Note>The shift arc: the moon travels the twelve hours (sped up here).</Note>
            </div>
            <div className="surface flex flex-col items-center justify-between p-6">
              <div key={rise} className="anim-rise surface-raised w-full p-5" lang="bn">
                <p className="text-label text-cream">রাখা হয়েছে</p>
                <p className="text-body text-sand">শুধু এই ফোনে</p>
              </div>
              <button
                type="button"
                onClick={() => setRise((r) => r + 1)}
                className="mt-4 flex min-h-tap items-center gap-2 rounded-full border border-amber/40 px-5 text-[17px] text-cream"
              >
                <RotateCcw size={20} strokeWidth={1.75} aria-hidden="true" /> Replay
              </button>
              <Note>Screen entry: fade + 12px rise, 320ms, cubic-bezier(0.22, 1, 0.36, 1).</Note>
            </div>
          </div>
        </Section>

        {/* Home states */}
        <Section
          title="Home in four states"
          note="The home screen follows the shift. These buttons move the app's clock (this session only) and open Home."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {states.map(([ms, title, sub]) => (
              <button
                key={title}
                type="button"
                onClick={() => openHomeAt(ms)}
                className="surface flex flex-col items-start p-5 text-left transition-colors hover:border-amber/50"
              >
                <span className="font-serif text-[22px] text-amber-text">{hhmm(ms)}</span>
                <span className="text-[18px] font-semibold text-cream">{title}</span>
                <span className="text-[15px] text-sand">{sub}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                resetClock()
                navigate('/')
              }}
              className="surface flex flex-col items-start p-5 text-left transition-colors hover:border-amber/50"
            >
              <span className="font-serif text-[22px] text-amber-text">
                <Check size={22} className="inline" aria-hidden="true" /> Now
              </span>
              <span className="text-[18px] font-semibold text-cream">Real time</span>
              <span className="text-[15px] text-sand">Reset the clock</span>
            </button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[16px] text-sand">
            <Link2 size={18} aria-hidden="true" /> A direct link also works:{' '}
            <code className="text-amber-text">#/?at=18:20</code>
          </p>
        </Section>
      </div>
    </>
  )
}
