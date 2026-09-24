import { useRef } from 'react'
import { readAloud } from './speech.js'
import { useLang } from '../store/app.js'

const HOLD_MS = 550

/**
 * Long-press any control to hear (and see) its label. A long press never also
 * fires the tap underneath it.
 */
export function useLongPress(label) {
  const lang = useLang((s) => s.lang)
  const timer = useRef(null)
  const fired = useRef(false)

  const clear = () => {
    clearTimeout(timer.current)
    timer.current = null
  }

  return {
    onPointerDown: () => {
      fired.current = false
      clear()
      timer.current = setTimeout(() => {
        fired.current = true
        navigator.vibrate?.(12)
        readAloud(label, lang)
      }, HOLD_MS)
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e) => e.preventDefault(),
    onClickCapture: (e) => {
      if (fired.current) {
        e.preventDefault()
        e.stopPropagation()
        fired.current = false
      }
    },
  }
}
