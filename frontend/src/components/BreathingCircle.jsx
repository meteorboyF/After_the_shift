import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * The breathing exercise's circle. The timing IS the exercise:
 * 4s in (1 → 1.6), 2s hold, 6s out (1.6 → 1). A 12s cycle.
 *
 * Under prefers-reduced-motion the circle does not scale; its light rises and
 * falls on the same timing instead.
 */
export const BREATH = { inSec: 4, holdSec: 2, outSec: 6 }
const CYCLE = BREATH.inSec + BREATH.holdSec + BREATH.outSec

export function phaseAt(sec) {
  const t = sec % CYCLE
  if (t < BREATH.inSec) return 'in'
  if (t < BREATH.inSec + BREATH.holdSec) return 'hold'
  return 'out'
}

function scaleAt(sec) {
  const t = sec % CYCLE
  const ease = (x) => 0.5 - Math.cos(Math.PI * x) / 2 // easeInOutSine
  if (t < BREATH.inSec) return 1 + 0.6 * ease(t / BREATH.inSec)
  if (t < BREATH.inSec + BREATH.holdSec) return 1.6
  return 1.6 - 0.6 * ease((t - BREATH.inSec - BREATH.holdSec) / BREATH.outSec)
}

export function useBreath(running = true) {
  const [sec, setSec] = useState(0)
  useEffect(() => {
    if (!running) return undefined
    const start = performance.now()
    let raf
    const loop = (now) => {
      setSec((now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])
  return sec
}

export default function BreathingCircle({ sec, size = 120 }) {
  const reduced = useReducedMotion()
  const s = scaleAt(sec)
  const glow = (s - 1) / 0.6 // 0..1
  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.7, height: size * 1.7 }}>
      <div
        className="rounded-full border-2 border-amber"
        style={{
          width: size,
          height: size,
          transform: reduced ? 'none' : `scale(${s})`,
          background: `radial-gradient(circle at 50% 35%, rgba(255,196,107,${0.12 + glow * 0.28}), rgba(232,161,58,0.06) 70%)`,
          boxShadow: `0 0 ${20 + glow * 50}px rgba(232,161,58,${0.25 + glow * 0.35})`,
          opacity: reduced ? 0.45 + glow * 0.55 : 1,
        }}
      />
    </div>
  )
}
