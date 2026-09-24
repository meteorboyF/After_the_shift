import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Served from https://meteorboyf.github.io/After_the_shift/.
 *
 * Routing is hash-based (see App.jsx), so every route is the same static
 * index.html as far as GitHub Pages is concerned — no 404.html trick, no 404
 * status on deep links.
 *
 * The service worker precaches the whole app shell, fonts and scene images, so
 * after one visit the app opens with no network at all (rule 8).
 */
export default defineConfig({
  base: '/After_the_shift/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['lamp.svg', 'scenes/*.webp'],
      manifest: {
        name: 'শিফটের পরে — After the Shift',
        short_name: 'শিফটের পরে',
        lang: 'bn',
        start_url: '/After_the_shift/',
        scope: '/After_the_shift/',
        display: 'standalone',
        background_color: '#12151F',
        theme_color: '#12151F',
        icons: [{ src: 'lamp.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webp,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
