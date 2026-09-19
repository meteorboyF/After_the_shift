/**
 * MediaRecorder + AnalyserNode.
 *
 * The waveform on screen 1B is driven by the real microphone signal, not a
 * decorative random animation — a guard should be able to tell, by looking,
 * that the phone is actually hearing them.
 */

export const BAND_COUNT = 7

/**
 * Collapse the analyser's frequency bins into BAND_COUNT levels in 0..1.
 *
 * Pure so the maths can be checked without a microphone. Only the lower half
 * of the spectrum is used — speech energy lives there, and including the empty
 * top half would flatten every bar.
 */
export function bandsFromFrequencyData(data, bandCount = BAND_COUNT) {
  const usable = Math.floor(data.length / 2)
  const perBand = Math.max(1, Math.floor(usable / bandCount))
  const bands = []

  for (let b = 0; b < bandCount; b += 1) {
    let sum = 0
    const start = b * perBand
    const end = Math.min(start + perBand, usable)
    for (let i = start; i < end; i += 1) sum += data[i]
    const count = Math.max(1, end - start)
    bands.push(sum / count / 255)
  }
  return bands
}

/**
 * Start capturing. Resolves with a handle exposing stop() and the live band
 * levels via onLevels.
 *
 * Throws only if the microphone itself is unavailable; callers treat that as
 * "save without audio" rather than as a dead end.
 */
export async function startRecording({ onLevels } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  const AudioCtx = window.AudioContext || window.webkitAudioContext
  const context = new AudioCtx()
  const analyser = context.createAnalyser()
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.72
  context.createMediaStreamSource(stream).connect(analyser)

  const spectrum = new Uint8Array(analyser.frequencyBinCount)
  let frame = null

  const tick = () => {
    analyser.getByteFrequencyData(spectrum)
    onLevels?.(bandsFromFrequencyData(spectrum))
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)

  // Opus in WebM where available; Safari falls back to its own default.
  const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(
    (type) => window.MediaRecorder?.isTypeSupported?.(type),
  )
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  const chunks = []
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data)
  }
  recorder.start()

  const startedAt = Date.now()

  const teardown = () => {
    if (frame) cancelAnimationFrame(frame)
    stream.getTracks().forEach((track) => track.stop())
    context.close().catch(() => {})
  }

  return {
    mimeType: recorder.mimeType || mimeType || 'audio/webm',
    elapsedSec: () => (Date.now() - startedAt) / 1000,
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          teardown()
          resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }))
        }
        if (recorder.state === 'inactive') {
          teardown()
          resolve(new Blob(chunks, { type: 'audio/webm' }))
        } else {
          recorder.stop()
        }
      }),
    /** Abandon without producing a blob. */
    cancel: () => {
      try {
        if (recorder.state !== 'inactive') recorder.stop()
      } catch {
        /* already stopped */
      }
      teardown()
    },
  }
}
