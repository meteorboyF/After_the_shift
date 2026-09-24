/**
 * Design tokens — "a lamp left on for someone coming home late".
 *
 * Base palette from CLAUDE.md, plus the text and zone tokens the rebuild needs.
 * Every text token is ≥ 7:1 on `ink` (see /styleguide for the measured ratios).
 * `muted` is decoration only — never used for words a guard has to read.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#12151F', soft: '#1A1F2E', raised: '#232939', line: '#2E3548' },
        amber: { DEFAULT: '#E8A13A', deep: '#B26B00', glow: '#FFC46B', text: '#F2B45A' },
        cream: '#F5EDE1',
        sand: '#C4BBAD',
        muted: '#8A93A6',
        ok: '#7FC497',
        warn: '#E09A6B',
        zone: {
          mine: '#F2B45A',
          peers: '#7CCABD',
          super: '#B9C0CE',
        },
      },
      fontFamily: {
        ui: ['"Hind Siliguri"', 'system-ui', 'sans-serif'],
        display: ['"Tiro Bangla"', '"Hind Siliguri"', 'serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        // Floor is 18px. Nothing a guard reads is smaller.
        body: ['18px', { lineHeight: '1.7' }],
        label: ['22px', { lineHeight: '1.6' }],
        'label-lg': ['26px', { lineHeight: '1.55' }],
        title: ['32px', { lineHeight: '1.45' }],
        hero: ['44px', { lineHeight: '1.3' }],
        // Presenter/styleguide annotations only — never in the guard's UI.
        note: ['14px', { lineHeight: '1.5' }],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      maxWidth: { phone: '480px' },
      minHeight: { tap: '64px' },
      minWidth: { tap: '64px' },
      transitionTimingFunction: { calm: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,196,107,0.25), 0 10px 36px -8px rgba(232,161,58,0.55)',
        'glow-lg': '0 0 0 1px rgba(255,196,107,0.35), 0 18px 60px -10px rgba(232,161,58,0.7)',
        lift: 'inset 0 1px 0 0 rgba(245,237,225,0.07)',
      },
    },
  },
  plugins: [],
}
