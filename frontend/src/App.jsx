import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomeScreen from './features/home/HomeScreen.jsx'
import PinScreen from './features/pin/PinScreen.jsx'
import RecordScreen from './features/checkin/RecordScreen.jsx'
import PrivacyScreen from './features/checkin/PrivacyScreen.jsx'
import SavedScreen from './features/checkin/SavedScreen.jsx'
import EntriesScreen from './features/checkin/EntriesScreen.jsx'
import PhasePlaceholder from './components/PhasePlaceholder.jsx'
import { useSettings } from './store/settings.js'
import { useCheckins } from './store/checkins.js'
import { isPinSupported } from './lib/pin.js'
import { useT } from './lib/useT.js'

/**
 * Routes render directly — no AnimatePresence wrapper.
 *
 * The documented `<AnimatePresence mode="wait">` + keyed `<Routes>` pattern
 * stalls here: under React 19's StrictMode the exiting child never reports
 * completion, so the URL changes while the previous screen stays on screen
 * permanently. A frozen screen mid-presentation is not a risk worth an exit
 * animation, so each screen animates on mount instead (ScreenShell) and nothing
 * gates the swap. The visible result is the same fade + 12px slide the spec
 * asks for, minus the crossfade on the way out.
 */
function AppRoutes() {
  const { t } = useT()

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />

      {/* Task 1 — post-shift check-in */}
      <Route path="/record" element={<RecordScreen />} />
      <Route path="/checkin/privacy" element={<PrivacyScreen />} />
      <Route path="/checkin/saved" element={<SavedScreen />} />
      <Route path="/entries" element={<EntriesScreen />} />

      {/* Phase 3 — Task 2 */}
      <Route
        path="/grounding"
        element={<PhasePlaceholder title={t('home.hardTime')} guard="after_incident" />}
      />

      {/* Phase 4 — Task 3 */}
      <Route
        path="/relief"
        element={<PhasePlaceholder title={t('common.appName')} guard="relief_granted" />}
      />
      <Route
        path="/supervisor"
        element={<PhasePlaceholder title={t('common.appName')} guard="day_post" />}
      />

      <Route
        path="/help"
        element={<PhasePlaceholder title={t('common.help')} guard="greeting" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/**
 * The PIN shell. Not a security boundary and not one of the three tasks — it
 * just keeps the check-in screens off the lock screen.
 *
 * Where SubtleCrypto is unavailable (a non-secure context) the PIN is skipped
 * entirely rather than falling back to storing the digits in the clear.
 */
function PinGate({ children }) {
  const { pinHash, pinSkipped, unlocked } = useSettings()

  if (!isPinSupported()) return children
  if (!pinHash && !pinSkipped) return <PinScreen mode="set" />
  if (pinHash && !unlocked) return <PinScreen mode="unlock" />
  return children
}

export default function App() {
  const lang = useSettings((s) => s.lang)
  const loadCheckins = useCheckins((s) => s.load)

  // Hydrate once at start so the summary screens are ready before they're
  // opened. Safe to call repeatedly — load() no-ops after the first run.
  useEffect(() => {
    loadCheckins()
  }, [loadCheckins])

  // Keep <html lang> in step with the toggle, so a screen reader announces
  // Bangla with Bangla phonetics rather than reading it as mislabelled English.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <BrowserRouter>
      <PinGate>
        <AppRoutes />
      </PinGate>
    </BrowserRouter>
  )
}
