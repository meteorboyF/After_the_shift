import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomeScreen from './features/home/HomeScreen.jsx'
import StyleguideScreen from './features/styleguide/StyleguideScreen.jsx'
import RosterScreen from './features/roster/RosterScreen.jsx'
import HoursScreen from './features/hours/HoursScreen.jsx'
import SummaryScreen from './features/hours/SummaryScreen.jsx'
import SwapScreen from './features/swap/SwapScreen.jsx'
import SleepScreen from './features/sleep/SleepScreen.jsx'
import HeatSignsScreen from './features/heat/HeatSignsScreen.jsx'
import IdCardScreen from './features/idcard/IdCardScreen.jsx'
import RecordScreen from './features/checkin/RecordScreen.jsx'
import PrivacyScreen from './features/checkin/PrivacyScreen.jsx'
import SavedScreen from './features/checkin/SavedScreen.jsx'
import EntriesScreen from './features/checkin/EntriesScreen.jsx'
import ChooseScreen from './features/grounding/ChooseScreen.jsx'
import ExerciseScreen from './features/grounding/ExerciseScreen.jsx'
import DoneScreen from './features/grounding/DoneScreen.jsx'
import NeedScreen from './features/relief/NeedScreen.jsx'
import ReasonScreen from './features/relief/ReasonScreen.jsx'
import PreviewScreen from './features/relief/PreviewScreen.jsx'
import StatusScreen from './features/relief/StatusScreen.jsx'
import { useCheckins } from './store/checkins.js'
import Caption from './components/Caption.jsx'
import { useApp, useLang } from './store/app.js'
import { startClock } from './lib/clock.js'

/**
 * Hash routing: /After_the_shift/#/relief. GitHub Pages only ever serves
 * index.html, so a pasted link can never 404 and never needs a redirect.
 */
function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  const hydrate = useApp((s) => s.hydrate)
  const lang = useLang((s) => s.lang)

  const loadCheckins = useCheckins((s) => s.load)
  useEffect(() => {
    startClock()
    hydrate()
    loadCheckins()
  }, [hydrate, loadCheckins])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <HashRouter>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/styleguide" element={<StyleguideScreen />} />

        {/* The practical layer — the reason to open the app on an ordinary day. */}
        <Route path="/roster" element={<RosterScreen />} />
        <Route path="/hours" element={<HoursScreen />} />
        <Route path="/hours/summary" element={<SummaryScreen />} />
        <Route path="/swap" element={<SwapScreen />} />
        <Route path="/sleep" element={<SleepScreen />} />
        <Route path="/heat" element={<HeatSignsScreen />} />
        <Route path="/id" element={<IdCardScreen />} />

        {/* Task 1 — post-shift check-in (MINE zone) */}
        <Route path="/checkin" element={<RecordScreen />} />
        <Route path="/checkin/privacy" element={<PrivacyScreen />} />
        <Route path="/checkin/saved" element={<SavedScreen />} />
        <Route path="/checkin/entries" element={<EntriesScreen />} />

        {/* Task 2 — grounding (MINE zone; nothing about a session is stored) */}
        <Route path="/grounding" element={<ChooseScreen />} />
        <Route path="/grounding/done" element={<DoneScreen />} />
        <Route path="/grounding/:type" element={<ExerciseScreen />} />

        {/* Task 3 — relief request (SUPERVISOR zone) */}
        <Route path="/relief" element={<NeedScreen />} />
        <Route path="/relief/reason" element={<ReasonScreen />} />
        <Route path="/relief/preview" element={<PreviewScreen />} />
        <Route path="/relief/status" element={<StatusScreen />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Caption />
    </HashRouter>
  )
}
