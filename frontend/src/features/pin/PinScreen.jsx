import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ScreenShell from '../../components/ScreenShell.jsx'
import LanguageToggle from '../../components/LanguageToggle.jsx'
import Icon from '../../components/Icon.jsx'
import PinPad from './PinPad.jsx'
import { useSettings } from '../../store/settings.js'
import { useT } from '../../lib/useT.js'
import { PIN_LENGTH } from '../../lib/pin.js'
import { confirmFeedback } from '../../lib/haptics.js'

/**
 * On-device PIN shell. Not one of the three tasks — it exists so the check-in
 * screens aren't the first thing a supervisor sees if they pick up the phone.
 *
 * Skipping is offered plainly, not buried: a guard who does not want a PIN
 * should not have to fight the app for that.
 */
export default function PinScreen({ mode }) {
  const { t } = useT()
  const reduced = useReducedMotion()
  const setPin = useSettings((s) => s.setPin)
  const verifyPin = useSettings((s) => s.verifyPin)
  const skipPin = useSettings((s) => s.skipPin)

  const [entry, setEntry] = useState('')
  const [firstPin, setFirstPin] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const confirming = mode === 'set' && firstPin !== null
  const heading = confirming
    ? t('pin.confirmHeading')
    : mode === 'set'
      ? t('pin.setHeading')
      : t('pin.unlockHeading')

  useEffect(() => {
    if (entry.length !== PIN_LENGTH || busy) return

    let cancelled = false
    const submit = async () => {
      setBusy(true)

      if (mode === 'unlock') {
        const ok = await verifyPin(entry)
        if (cancelled) return
        if (ok) {
          confirmFeedback()
        } else {
          setError(t('pin.wrong'))
          setEntry('')
        }
      } else if (firstPin === null) {
        setFirstPin(entry)
        setEntry('')
        setError(null)
      } else if (firstPin === entry) {
        await setPin(entry)
        if (cancelled) return
        confirmFeedback()
      } else {
        setError(t('pin.mismatch'))
        setFirstPin(null)
        setEntry('')
      }

      if (!cancelled) setBusy(false)
    }

    submit()
    return () => {
      cancelled = true
    }
  }, [entry, busy, mode, firstPin, setPin, verifyPin, t])

  const addDigit = (digit) => {
    if (busy) return
    setError(null)
    setEntry((current) => (current.length < PIN_LENGTH ? current + digit : current))
  }

  const erase = () => {
    if (busy) return
    setError(null)
    setEntry((current) => current.slice(0, -1))
  }

  return (
    <ScreenShell guard="greeting" guardOpacity={0.24} topRight={<LanguageToggle />}>
      <div className="flex flex-1 flex-col items-center justify-center pb-4">
        <Icon name="lamp" size={40} className="text-amber" />

        <h1 className="measure mt-5 text-center text-label-lg font-semibold text-cream">
          {heading}
        </h1>

        <p className="mt-2 text-center text-base text-muted">{t('pin.hint')}</p>

        {/* progress dots — never a text field */}
        <div className="mt-8 flex gap-4" aria-hidden="true">
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <motion.span
              key={i}
              animate={
                reduced ? undefined : { scale: i < entry.length ? [1, 1.25, 1] : 1 }
              }
              transition={{ duration: 0.24 }}
              className={`h-4 w-4 rounded-full transition-colors duration-200 ease-calm ${
                i < entry.length ? 'bg-amber shadow-glow' : 'bg-ink-raised'
              }`}
            />
          ))}
        </div>

        <p className="mt-5 min-h-[1.75rem] text-center text-base text-warn">{error ?? ''}</p>

        <div className="mt-2 w-full max-w-[19rem]">
          <PinPad onDigit={addDigit} onErase={erase} disabled={busy} />
        </div>
      </div>

      {mode === 'set' && (
        <button
          type="button"
          onClick={skipPin}
          className="tap mx-auto rounded-2xl px-4 py-3 text-base text-muted
            transition-colors duration-200 ease-calm hover:text-cream"
        >
          {t('pin.skip')}
        </button>
      )}
    </ScreenShell>
  )
}
