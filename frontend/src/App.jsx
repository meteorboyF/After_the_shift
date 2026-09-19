import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomeScreen from './features/home/HomeScreen.jsx'
import PinScreen from './features/pin/PinScreen.jsx'
import RecordScreen from './features/checkin/RecordScreen.jsx'
import PrivacyScreen from './features/checkin/PrivacyScreen.jsx'
import SavedScreen from './features/checkin/SavedScreen.jsx'
import EntriesScreen from './features/checkin/EntriesScreen.jsx'
import ChooseScreen from './features/grounding/ChooseScreen.jsx'
import ExerciseScreen from './features/grounding/ExerciseScreen.jsx'
import GroundingDoneScreen from './features/grounding/GroundingDoneScreen.jsx'
import NeedScreen from './features/relief/NeedScreen.jsx'
import ReasonScreen from './features/relief/ReasonScreen.jsx'
import PreviewScreen from './features/relief/PreviewScreen.jsx'
import StatusScreen from './features/relief/StatusScreen.jsx'
import SupervisorScreen from './features/supervisor/SupervisorScreen.jsx'
import PhasePlaceholder from './components/PhasePlaceholder.jsx'
import { useSettings } from './store/settings.js'
import { useCheckins } from './store/checkins.js'
import { useRelief } from './store/relief.js'
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

      {/* Task 2 — post-incident grounding. /grounding/done sits before the
          :type route so "done" is never mistaken for an exercise name. */}
      <Route path="/grounding" element={<ChooseScreen />} />
      <Route path="/grounding/done" element={<GroundingDoneScreen />} />
      <Route path="/grounding/:type" element={<ExerciseScreen />} />

      {/* Task 3 — relief request. Fixed paths precede none here, but keep
          /relief/status last-written for the same reason as grounding. */}
      <Route path="/relief" element={<NeedScreen />} />
      <Route path="/relief/reason" element={<ReasonScreen />} />
      <Route path="/relief/preview" element={<PreviewScreen />} />
      <Route path="/relief/status" element={<StatusScreen />} />

      {/* Demo only — proves the privacy wall during the presentation. */}
      <Route path="/supervisor" element={<SupervisorScreen />} />

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
  const loadRelief = useRelief((s) => s.load)

  // Hydrate once at start so the summary screens and the tally are ready before
  // they're opened. Safe to call repeatedly — load() no-ops after the first run.
  useEffect(() => {
    loadCheckins()
    loadRelief()
  }, [loadCheckins, loadRelief])

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
