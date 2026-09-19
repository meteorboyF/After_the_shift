/** @type {import('tailwindcss').Config} */

// Palette from the project deck: night shift, sodium lamp, warm amber on deep
// charcoal-navy. No pure black, no pure white, no pure red anywhere.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#12151F', soft: '#1A1F2E', raised: '#232939' },
        amber: { DEFAULT: '#E8A13A', deep: '#B26B00', glow: '#FFC46B' },
        cream: '#F5EDE1',
        muted: '#8A93A6',
        ok: '#5FA87A',
        warn: '#C97A4A', // stands in for red; this app never uses red
      },
      fontFamily: {
        // Bangla is the primary script, so it leads the stack on every element.
        bangla: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Base 18px: these users are often over 40, reading in sun or at 3am.
        base: ['1.125rem', { lineHeight: '1.75' }],
        label: ['1.375rem', { lineHeight: '1.7' }],
        'label-lg': ['1.625rem', { lineHeight: '1.6' }],
        display: ['2rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        // One light source, always from above. Amber glow, never a grey drop.
        glow: '0 0 32px -4px rgba(232, 161, 58, 0.45)',
        'glow-lg': '0 0 56px -6px rgba(232, 161, 58, 0.55)',
        raised: '0 8px 28px -12px rgba(0, 0, 0, 0.7)',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        haze: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        breathe: 'breathe 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        haze: 'haze 9s ease-in-out infinite',
      },
      maxWidth: {
        screenish: '480px', // mobile-first, single column, centred
      },
      minHeight: {
        tap: '64px', // minimum tap target
      },
      minWidth: {
        tap: '64px',
      },
    },
  },
  plugins: [],
}
