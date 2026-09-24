/** A participant's words — the research, visible. */
export default function Quote({ who, children, lang = 'en' }) {
  return (
    <figure className="relative pl-6">
      <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] rounded-full bg-amber/60" />
      <blockquote
        className={lang === 'bn' ? 'font-display text-label-lg text-cream' : 'font-serif text-[24px] italic leading-snug text-cream'}
      >
        {children}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2 text-body text-sand">
        <span className="rounded-full border border-amber/40 px-2.5 text-[16px] font-semibold text-amber-text">
          {who}
        </span>
      </figcaption>
    </figure>
  )
}
