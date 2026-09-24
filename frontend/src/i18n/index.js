import bn from './bn.js'
import en from './en.js'
import { useLang } from '../store/app.js'
import { num } from '../lib/format.js'

const DICTS = { bn, en }

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? node : node[part]), dict)
}

/**
 * t('home.endsIn', { d: '২ ঘণ্টা' }). Numbers in vars are localised; strings
 * are inserted as-is (callers pre-format durations and times).
 */
export function translate(lang, key, vars = {}) {
  let value = lookup(DICTS[lang], key)
  if (value == null) value = lookup(bn, key)
  if (typeof value !== 'string') return value ?? key
  return value.replace(/\{(\w+)\}/g, (_, name) => {
    const v = vars[name]
    if (v == null) return ''
    return typeof v === 'number' ? num(v, lang) : v
  })
}

export function useT() {
  const lang = useLang((s) => s.lang)
  return { lang, t: (key, vars) => translate(lang, key, vars) }
}
