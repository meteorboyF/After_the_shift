import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomeScreen from './features/home/HomeScreen.jsx'
import StyleguideScreen from './features/styleguide/StyleguideScreen.jsx'
import ComingScreen from './features/coming/ComingScreen.jsx'
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
import { translate } from './i18n/index.js'

/**
 * Hash routing: /After_the_shift/#/relief. GitHub Pages only ever serves
 * index.html, so a pasted link can never 404 and never needs a redirect.
 */
function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

/**
 * Review builds only (VITE_REVIEW=1, used for the hosted review link): open on
 * the style tile, and offer a way back to it from any screen. Never in the
 * guard's build.
 */
const REVIEW = import.meta.env.VITE_REVIEW === '1'
if (REVIEW && (window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/')) {
  window.location.hash = '#/styleguide'
}
function ReviewChip() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  if (!REVIEW || pathname === '/styleguide') return null
  return (
    <button
      type="button"
      onClick={() => navigate('/styleguide')}
      className="fixed left-1/2 top-2 z-40 -translate-x-1/2 rounded-full border border-amber/40 bg-ink/80 px-4 py-2 text-[15px] text-amber-text backdrop-blur"
    >
      Review · style tile
    </button>
  )
}

export default function App() {
  const hydrate = useApp((s) => s.hydrate)
  const lang = useLang((s) => s.lang)
  const tile = (key) => translate(lang, `home.tiles.${key}`)

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

        {/* Phase 4. Each already carries the zone its real screen will have. */}
        <Route path="/roster" element={<ComingScreen zone="super" title={tile('roster')} />} />
        <Route path="/hours" element={<ComingScreen zone="mine" title={tile('hours')} />} />
        <Route path="/swap" element={<ComingScreen zone="peers" title={tile('swap')} />} />

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
        <Route path="/sleep" element={<ComingScreen zone="mine" title={translate(lang, 'home.rotationLink')} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Caption />
      <ReviewChip />
    </HashRouter>
  )
}
