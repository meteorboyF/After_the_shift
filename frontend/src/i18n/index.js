import bn from './bn.js'
import en from './en.js'
import { localeDigits } from '../lib/format.js'

export const DICTIONARIES = { bn, en }
export const LANGUAGES = ['bn', 'en']
export const PRIMARY_LANGUAGE = 'bn'

function lookup(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict)
}

/**
 * Resolve a dotted key for `lang`, falling back to Bangla — the primary — and
 * finally to the key itself so a missing string is loud in review rather than
 * silently blank.
 *
 * Values in {braces} are substituted from `vars` and any digits in them are
 * rendered in the active script.
 */
export function translate(lang, key, vars) {
  const raw =
    lookup(DICTIONARIES[lang] ?? {}, key) ??
    lookup(DICTIONARIES[PRIMARY_LANGUAGE], key) ??
    key

  if (typeof raw !== 'string') return key
  if (!vars) return localeDigits(raw, lang)

  return raw.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? localeDigits(vars[name], lang) : match,
  )
}
