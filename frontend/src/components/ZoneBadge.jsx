import { Building2, Lock, Users } from 'lucide-react'
import { ZONES } from '../lib/zones.js'
import { readAloud } from '../lib/speech.js'
import { useLang } from '../store/app.js'

const ICONS = { mine: Lock, peers: Users, super: Building2 }
const TONE = {
  mine: 'text-zone-mine border-zone-mine/35 bg-zone-mine/10',
  peers: 'text-zone-peers border-zone-peers/35 bg-zone-peers/10',
  super: 'text-zone-super border-zone-super/35 bg-zone-super/10',
}

/**
 * Who can see what is on this screen. Same place on every screen (top-right),
 * icon + one word. Tapping explains the zone in one spoken sentence.
 */
export default function ZoneBadge({ zone }) {
  const lang = useLang((s) => s.lang)
  const z = ZONES[zone]
  const Icon = ICONS[zone]
  const word = lang === 'bn' ? z.bn : z.en
  const explain = lang === 'bn' ? z.explainBn : z.explainEn

  return (
    <button
      type="button"
      onClick={() => readAloud(explain, lang)}
      aria-label={`${word}. ${explain}`}
      className="tap -mr-2 flex items-center justify-end px-2"
    >
      <span
        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[18px] font-medium leading-none ${TONE[zone]}`}
      >
        <Icon size={18} strokeWidth={2} aria-hidden="true" />
        <span className="pt-0.5">{word}</span>
      </span>
    </button>
  )
}
