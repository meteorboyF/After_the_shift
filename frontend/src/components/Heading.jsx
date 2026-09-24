import { useLang } from '../store/app.js'

/** The one heading per screen: Tiro Bangla in Bangla, Fraunces in English. */
export default function Heading({ children, size = 'title', className = '' }) {
  const lang = useLang((s) => s.lang)
  const face =
    lang === 'bn'
      ? `font-display ${size === 'hero' ? 'text-hero' : 'text-title'}`
      : `font-serif font-semibold leading-tight ${size === 'hero' ? 'text-[40px]' : 'text-[32px]'}`
  return <h1 className={`${face} text-cream [text-wrap:balance] ${className}`}>{children}</h1>
}
