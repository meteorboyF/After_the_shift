import { useCallback } from 'react'
import { useSettings } from '../store/settings.js'
import { translate } from '../i18n/index.js'
import { localeDigits } from './format.js'

/**
 * t('home.shiftLine', { hours: 12 }) → '১২ ঘণ্টা শেষ হয়েছে'
 *
 * Also returns the active language and a digit helper, since most screens that
 * need one need the other.
 */
export function useT() {
  const lang = useSettings((s) => s.lang)
  const t = useCallback((key, vars) => translate(lang, key, vars), [lang])
  const n = useCallback((value) => localeDigits(value, lang), [lang])
  return { t, n, lang }
}
