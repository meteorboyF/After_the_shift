import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomeScreen from './features/home/HomeScreen.jsx'
import StyleguideScreen from './features/styleguide/StyleguideScreen.jsx'
import ComingScreen from './features/coming/ComingScreen.jsx'
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

  useEffect(() => {
    startClock()
    hydrate()
  }, [hydrate])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <HashRouter>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/styleguide" element={<StyleguideScreen />} />

        {/* Phase 3–4. Each already carries the zone its real screen will have. */}
        <Route path="/roster" element={<ComingScreen zone="super" title={tile('roster')} />} />
        <Route path="/hours" element={<ComingScreen zone="mine" title={tile('hours')} />} />
        <Route path="/relief" element={<ComingScreen zone="super" title={tile('relief')} />} />
        <Route path="/swap" element={<ComingScreen zone="peers" title={tile('swap')} />} />
        <Route path="/checkin" element={<ComingScreen zone="mine" />} />
        <Route path="/grounding" element={<ComingScreen zone="mine" title={translate(lang, 'home.hardTime')} />} />
        <Route path="/sleep" element={<ComingScreen zone="mine" title={translate(lang, 'home.rotationLink')} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Caption />
      <ReviewChip />
    </HashRouter>
  )
}
