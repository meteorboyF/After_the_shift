import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * GitHub Pages serves a project site from /<repo>/, not from the domain root,
 * so the build needs a base path. Local dev stays at "/" — set BASE_PATH only
 * in the Pages workflow.
 */
const base = process.env.BASE_PATH ?? '/'

/**
 * Pages has no SPA rewrite rule: a deep link like /After_the_shift/relief is a
 * real 404 as far as the static host is concerned. Serving the same document as
 * 404.html makes the router pick the route up instead, so refreshing on any
 * screen works.
 */
function spaFallback() {
  return {
    name: 'pages-spa-fallback',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
})
