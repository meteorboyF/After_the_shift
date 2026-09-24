import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Microphone capture: MediaRecorder for the audio, AnalyserNode for a 7-bar
 * level meter driven by the real signal (not a decorative animation — a guard
 * should be able to see that the phone is actually hearing him).
 *
 * Failure is never a dead end: no microphone means the entry can still be kept,
 * just without sound.
 */
export const BANDS = 7

export function bandsFrom(data, count = BANDS) {
  const usable = Math.floor(data.length / 2) // speech energy lives in the lower half
  const per = Math.max(1, Math.floor(usable / count))
  const out = []
  for (let b = 0; b < count; b += 1) {
    let sum = 0
    for (let i = b * per; i < Math.min((b + 1) * per, usable); i += 1) sum += data[i]
    out.push(Math.min(1, Math.sqrt(sum / per / 255) * 1.15))
  }
  return out
}

async function openMic(onLevels) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const Ctx = window.AudioContext || window.webkitAudioContext
  const ctx = new Ctx()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  analyser.smoothingTimeConstant = 0.7
  ctx.createMediaStreamSource(stream).connect(analyser)
  const spectrum = new Uint8Array(analyser.frequencyBinCount)
  let raf = 0
  let last = 0
  const tick = (t) => {
    if (t - last > 60) {
      analyser.getByteFrequencyData(spectrum)
      onLevels(bandsFrom(spectrum))
      last = t
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((m) =>
    window.MediaRecorder?.isTypeSupported?.(m),
  )
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
  const chunks = []
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
  rec.start(250)

  const teardown = () => {
    cancelAnimationFrame(raf)
    stream.getTracks().forEach((t) => t.stop())
    ctx.close().catch(() => {})
  }
  return {
    stop: () =>
      new Promise((resolve) => {
        const type = rec.mimeType || mime || 'audio/webm'
        if (rec.state === 'inactive') {
          teardown()
          resolve(new Blob(chunks, { type }))
          return
        }
        rec.onstop = () => {
          teardown()
          resolve(new Blob(chunks, { type }))
        }
        rec.stop()
      }),
    cancel: () => {
      try {
        if (rec.state !== 'inactive') rec.stop()
      } catch {
        /* already stopped */
      }
      teardown()
    },
  }
}

/** Best-effort Bangla transcript. Nothing waits on it. */
function openTranscriber(onText) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!R) return null
  try {
    const r = new R()
    r.lang = 'bn-BD'
    r.continuous = true
    r.interimResults = true
    let final = ''
    r.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      onText((final + interim).trim())
    }
    r.onerror = () => {}
    r.start()
    return { stop: () => { try { r.stop() } catch { /* */ } } }
  } catch {
    return null
  }
}

/**
 * Starts recording as soon as it mounts (`autoStart`) or when start() is called.
 * status: idle | starting | recording | failed | done
 */
export function useRecorder({ autoStart = false } = {}) {
  const [status, setStatus] = useState('idle')
  const [levels, setLevels] = useState([])
  const [elapsed, setElapsed] = useState(0)
  const handle = useRef(null)
  const transcriber = useRef(null)
  const transcript = useRef('')
  const startedAt = useRef(0)
  const timer = useRef(0)

  const start = useCallback(async () => {
    setStatus('starting')
    startedAt.current = Date.now()
    setElapsed(0)
    clearInterval(timer.current)
    timer.current = setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 250)
    try {
      handle.current = await openMic(setLevels)
      transcriber.current = openTranscriber((t) => {
        transcript.current = t
      })
      setStatus('recording')
    } catch {
      setStatus('failed')
    }
  }, [])

  const stop = useCallback(async () => {
    clearInterval(timer.current)
    const durationSec = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
    transcriber.current?.stop()
    const blob = handle.current ? await handle.current.stop() : null
    handle.current = null
    setStatus('done')
    return { blob: blob && blob.size ? blob : null, durationSec, transcript: transcript.current || null }
  }, [])

  const cancel = useCallback(() => {
    clearInterval(timer.current)
    transcriber.current?.stop()
    handle.current?.cancel()
    handle.current = null
    setStatus('idle')
  }, [])

  useEffect(() => {
    if (autoStart) start()
    return () => {
      clearInterval(timer.current)
      transcriber.current?.stop()
      handle.current?.cancel()
    }
  }, [autoStart, start])

  return { status, levels, elapsed, start, stop, cancel }
}

/** "০:৪৮" */
export function clockElapsed(sec, digits) {
  const s = Math.floor(sec)
  return digits(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`)
}
