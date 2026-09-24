import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdCard, X } from 'lucide-react'
import { useT } from '../../i18n/index.js'

/**
 * 5.12 ID rule card — the institution speaks, not the guard.
 * P6: "if we check their cards, then we become the bad guys." The card moves
 * the authority from the man to the rule. Light paper, large type, both
 * languages, so it reads in sunlight when turned toward a student.
 */
export default function IdCardScreen() {
  const navigate = useNavigate()
  const { t } = useT()
  useEffect(() => {
    let lock = null
    navigator.wakeLock?.request?.('screen').then((l) => (lock = l)).catch(() => {})
    return () => lock?.release?.().catch(() => {})
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-cream px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-[max(env(safe-area-inset-top),20px)] text-ink">
      <main className="mx-auto flex w-full max-w-phone flex-1 flex-col items-center justify-center gap-6 text-center">
        <p className="text-label font-semibold" lang="bn">
          {t('idcard.university')}
        </p>
        <p className="text-body" lang="en">
          United International University
        </p>
        <span className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-ink text-ink">
          <IdCard size={60} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div lang="bn">
          <p className="font-display text-title">{t('idcard.rule')}</p>
          <p className="mt-2 font-display text-hero leading-tight">{t('idcard.ruleBody')}</p>
        </div>
        <div lang="en" className="border-t-2 border-ink/20 pt-5">
          <p className="font-serif text-[24px] font-semibold">{t('idcard.ruleEn')}</p>
          <p className="font-serif text-[30px] leading-tight">{t('idcard.ruleBodyEn')}</p>
        </div>
        <p className="text-label">{t('idcard.thanks')}</p>
      </main>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mx-auto mt-4 flex min-h-[72px] w-full max-w-phone items-center justify-center gap-3 rounded-4xl border-2 border-ink/30 text-label font-semibold text-ink"
      >
        <X size={26} strokeWidth={2} aria-hidden="true" />
        {t('idcard.close')}
      </button>
    </div>
  )
}
