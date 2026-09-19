/**
 * Audio is kept as base64 rather than a Blob so one representation works for
 * IndexedDB, playback and the API body without conversion at each boundary.
 */

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onloadend = () => {
      const result = String(reader.result)
      // strip the "data:audio/webm;codecs=opus;base64," prefix
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.readAsDataURL(blob)
  })
}

export function base64ToObjectUrl(base64, mimeType = 'audio/webm') {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }))
}

/** mm:ss, with digits in the caller's script. */
export function formatElapsed(seconds, localise = (v) => String(v)) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${localise(mins)}:${localise(String(secs).padStart(2, '0'))}`
}
