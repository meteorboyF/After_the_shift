/**
 * Line icons drawn in the app's own palette.
 *
 * The spec sketches the coping and relief cards with emoji (💧 ◎ 👣 / 🕐 ⇄ ☂).
 * Emoji render as fixed colour glyphs that sit outside the amber-on-ink palette
 * — the same problem §4 raises about photos looking like pasted stock. These
 * are the same symbols as strokes that inherit currentColor instead.
 */

const PATHS = {
  // water on the face
  water: <path d="M12 3.5c3.2 3.6 5.5 6.4 5.5 9.1a5.5 5.5 0 0 1-11 0c0-2.7 2.3-5.5 5.5-9.1Z" />,
  // slow breathing
  breathe: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  // a short walk
  walk: (
    <>
      <circle cx="13.2" cy="4.6" r="1.9" />
      <path d="M11 21l1.7-5.2-2.4-2.5.9-4.4 3 1.6 2.4 2.3" />
      <path d="M7.7 13.1l1.9-3.6M16.3 21l-1.5-4" />
    </>
  ),
  // half an hour of rest
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 6.8V12l3.3 2" />
    </>
  ),
  // change of post
  swap: (
    <>
      <path d="M4 9h13.5M14 5.5 17.5 9 14 12.5" />
      <path d="M20 15H6.5M10 11.5 6.5 15 10 18.5" />
    </>
  ),
  // a post in the shade
  shade: (
    <>
      <path d="M3.6 11.4a8.4 8.4 0 0 1 16.8 0Z" />
      <path d="M12 11.4V19a2.2 2.2 0 0 0 4.4 0" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </>
  ),
  tick: <path d="M4.5 12.7 9.5 17.5 19.5 6.5" />,
  cross: <path d="M6 6l12 12M18 6 6 18" />,
  back: <path d="M15 5l-7 7 7 7" />,
  speaker: (
    <>
      <path d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4Z" />
      <path d="M15.6 9a4.3 4.3 0 0 1 0 6M18.2 6.4a8 8 0 0 1 0 11.2" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M9.6 9.6a2.5 2.5 0 1 1 3.2 2.6c-.6.2-.9.7-.9 1.4v.5" />
      <path d="M12 17.4h.01" />
    </>
  ),
  list: <path d="M5 7h14M5 12h14M5 17h9" />,
  lamp: (
    <>
      <path d="M6.5 10.5a5.5 5.5 0 0 1 11 0Z" />
      <path d="M12 10.5V20M9 20h6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8M12 3.6c2.2 2.4 3.3 5.2 3.3 8.4s-1.1 6-3.3 8.4c-2.2-2.4-3.3-5.2-3.3-8.4S9.8 6 12 3.6Z" />
    </>
  ),
}

export default function Icon({ name, size = 24, strokeWidth = 1.8, className = '' }) {
  const glyph = PATHS[name]
  if (!glyph) return null

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {glyph}
    </svg>
  )
}
