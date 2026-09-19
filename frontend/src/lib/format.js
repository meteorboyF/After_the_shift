const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

/** 12 → ১২. Applied at render time so sentences aren't duplicated per script. */
export function toBanglaDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)])
}

export function localeDigits(value, lang) {
  return lang === 'bn' ? toBanglaDigits(value) : String(value)
}

/** Zero-padded clock time, in the caller's script. e.g. 9 → "৯টা" handled by callers. */
export function localeNumber(value, lang) {
  return localeDigits(value, lang)
}
