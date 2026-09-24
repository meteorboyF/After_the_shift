import { Building2, Lock, Users } from 'lucide-react'
import { useLongPress } from '../lib/useLongPress.js'

const ZONE_ICON = { mine: Lock, peers: Users, super: Building2 }
const ZONE_TONE = { mine: 'text-zone-mine', peers: 'text-zone-peers', super: 'text-zone-super' }

/**
 * A home tile: icon, name, and one live fact — so every tile is useful before it
 * is even opened. The small corner mark shows the zone of the screen it opens.
 */
export default function Tile({ icon: Icon, label, fact, zone, onClick }) {
  const press = useLongPress(fact ? `${label}. ${fact}` : label)
  const ZoneIcon = ZONE_ICON[zone]
  return (
    <button
      type="button"
      onClick={onClick}
      {...press}
      className="surface group relative flex min-h-[116px] flex-col items-start gap-2 px-4 pb-3.5 pt-3.5 text-left
        transition-[transform,border-color] duration-300 ease-calm hover:border-amber/40 active:scale-[0.985]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber/10 text-amber-glow">
        <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
      </span>
      {ZoneIcon && (
        <ZoneIcon
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`absolute right-4 top-4 opacity-70 ${ZONE_TONE[zone]}`}
        />
      )}
      <span className="flex flex-col">
        <span className="text-label font-semibold leading-tight text-cream">{label}</span>
        {fact && <span className="mt-0.5 text-body leading-snug text-sand">{fact}</span>}
      </span>
    </button>
  )
}
