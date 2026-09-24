import { create } from 'zustand'

/**
 * Reading labels aloud.
 *
 * Many laptops and phones have no Bangla voice. Speaking Bangla text with an
 * English voice produces noise, so we only speak when a matching voice exists.
 * Either way the words are also shown large on screen (the caption), so a
 * long-press always produces a visible result.
 */
let voices = []
function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  voices = window.speechSynthesis.getVoices()
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
}

export function voiceFor(lang) {
  const prefix = lang === 'bn' ? 'bn' : 'en'
  return voices.find((v) => v.lang?.toLowerCase().startsWith(prefix)) ?? null
}

export function speak(text, lang = 'bn') {
  const voice = voiceFor(lang)
  if (!voice || !window.speechSynthesis) return false
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice
  u.lang = voice.lang
  u.rate = 0.9
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
  return true
}

export const useCaption = create((set) => ({
  text: null,
  spoken: false,
  show(text, spoken) {
    set({ text, spoken })
    clearTimeout(useCaption.timer)
    useCaption.timer = setTimeout(() => set({ text: null }), 3200)
  },
  hide() {
    set({ text: null })
  },
}))

/** Say it (if we can) and show it (always). */
export function readAloud(text, lang) {
  const spoken = speak(text, lang)
  useCaption.getState().show(text, spoken)
}
