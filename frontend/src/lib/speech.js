/**
 * Bangla speech, both directions.
 *
 * Recognition is a bonus, never a requirement: where the browser has no Bangla
 * SpeechRecognition the entry is still recorded and still saved, just without a
 * transcript. Nothing in the UI waits on this.
 */

const BANGLA = 'bn-BD'

function recognitionClass() {
  return typeof window === 'undefined'
    ? null
    : window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function isTranscriptionSupported() {
  return recognitionClass() !== null
}

/**
 * Returns a handle, or null when unsupported — callers check for null and carry
 * on rather than branching on a thrown error.
 */
export function startTranscription({ onText } = {}) {
  const Recognition = recognitionClass()
  if (!Recognition) return null

  const recognition = new Recognition()
  recognition.lang = BANGLA
  recognition.continuous = true
  recognition.interimResults = true

  let finalText = ''

  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i]
      if (result.isFinal) finalText += result[0].transcript
      else interim += result[0].transcript
    }
    onText?.((finalText + interim).trim())
  }

  // A recognition error must never surface to the guard or stop the recording.
  recognition.onerror = () => {}

  try {
    recognition.start()
  } catch {
    return null
  }

  return {
    stop: () => {
      try {
        recognition.stop()
      } catch {
        /* already stopped */
      }
      return finalText.trim()
    },
  }
}

/** Reads the coping options aloud on screen 2B. */
export function speak(text, { lang = BANGLA } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.92
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
