import { Moon, Sun } from 'lucide-react'

/**
 * The shift as a sky: a low arc from the shift's start to its end, with the sun
 * (day) or moon (night) travelling along it. Twelve hours at a glance, without
 * a number to read. The countdown sits under the horizon, never under the sun.
 */
const W = 320
const RX = 146
const RY = 64
const CX = W / 2
const CY = RY + 16
const H = CY + 22

function pointAt(p) {
  const angle = Math.PI * (1 - p) // 180° → 0°
  return { x: CX + RX * Math.cos(angle), y: CY - RY * Math.sin(angle) }
}

export default function ShiftArc({ progress = 0, kind = 'NIGHT', startLabel, endLabel }) {
  const p = Math.min(1, Math.max(0, progress))
  const dot = pointAt(p)
  const Body = kind === 'DAY' ? Sun : Moon
  const x0 = CX - RX
  const x1 = CX + RX
  const whole = `M ${x0} ${CY} A ${RX} ${RY} 0 0 1 ${x1} ${CY}`
  const lit = p > 0.001 ? `M ${x0} ${CY} A ${RX} ${RY} 0 0 1 ${dot.x.toFixed(2)} ${dot.y.toFixed(2)}` : null

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="arc-lit" x1="0" x2="1">
            <stop offset="0" stopColor="#B26B00" />
            <stop offset="1" stopColor="#FFC46B" />
          </linearGradient>
          <radialGradient id="arc-sun">
            <stop offset="0" stopColor="#FFC46B" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFC46B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="2" x2={W - 2} y1={CY} y2={CY} stroke="#2E3548" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" />
        <path d={whole} fill="none" stroke="#2E3548" strokeWidth="5" strokeLinecap="round" />
        {lit && <path d={lit} fill="none" stroke="url(#arc-lit)" strokeWidth="5" strokeLinecap="round" />}
        <circle cx={dot.x} cy={dot.y} r="30" fill="url(#arc-sun)" />
        <circle cx={dot.x} cy={dot.y} r="15" fill="#12151F" stroke="#FFC46B" strokeWidth="2" />
      </svg>
      <Body
        size={18}
        strokeWidth={2}
        className="absolute -translate-x-1/2 -translate-y-1/2 text-amber-glow"
        style={{ left: `${(dot.x / W) * 100}%`, top: `${(dot.y / H) * 100}%` }}
        aria-hidden="true"
      />
      {(startLabel || endLabel) && (
        <div className="mt-1 flex justify-between text-body leading-none text-sand">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </div>
  )
}
